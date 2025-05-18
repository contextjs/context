/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import path from "path";
import typescript from "typescript";
import { ExtensionsResolver } from "../../extensions/extensions-resolver.js";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class BuildCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === "project" || arg.name === "-p");
        const projects = this.getProjects(projectCommand?.values || []);

        if (projects.length === 0) {
            Console.writeLineError("No projects found. Exiting...");
            return process.exit(1);
        }

        const typescriptOptions = Console.parseTypescriptArguments(command.args);
        const transformersArg = command.args.find(arg => arg.name === "--transformers" || arg.name === "-t");

        await ExtensionsResolver.registerAsync();
        await Promise.all(projects.map(project => this.buildAsync(project, typescriptOptions, transformersArg?.values[0].split(",") ?? [])));

        return process.exit(0);
    }

    private async buildAsync(project: Project, typescriptOptions: typescript.CompilerOptions, externalTransformerPaths: string[]): Promise<void> {
        try {
            Console.writeLine(`Building project: "${project.name}"...`);

            const contextFilePath = path.join(project.path, "context.ctxp");
            const tsConfigPath = path.join(project.path, "tsconfig.json");

            if (!File.exists(contextFilePath)) {
                Console.writeLineError("No context file found. Exiting...");
                return process.exit(1);
            }

            if (!File.exists(tsConfigPath)) {
                Console.writeLineError("No tsconfig.json file found. Exiting...");
                return process.exit(1);
            }

            const contextJson = JSON.parse(File.read(contextFilePath)!);
            const configuredTransformers = contextJson.compilerOptions?.transformers ?? [];
            const transformers = [...configuredTransformers, ...externalTransformerPaths]

            await this.compileAsync(project, typescriptOptions, transformers);
            this.copyFiles(project, contextJson);

            Console.writeLineSuccess(`Project "${project.name}" built successfully.`);
        }
        catch (error: any) {
            Console.writeLineError(`Error building project "${project.name}".`);
            console.log(error);
            return process.exit(1);
        }
    }

    private copyFiles(project: Project, contextJson: any): void {
        if (Array.isArray(contextJson.files)) {
            for (const file of contextJson.files) {
                try {
                    const sourcePath = path.join(project.path, file.from);
                    const targetPath = path.join(project.path, file.to);

                    if (!File.exists(sourcePath)) {
                        Console.writeLineError(`File "${file.from}" not found. Exiting...`);
                        return process.exit(1);
                    }

                    File.copy(sourcePath, targetPath);
                }
                catch (error: any) {
                    Console.writeLineError(`Error copying file "${file.from}" to "${file.to}".`);
                    Console.writeLineError(error);
                    return process.exit(1);
                }
            }
        }
    }

    private async compileAsync(project: Project, typescriptOptions: typescript.CompilerOptions, transformers: string[]): Promise<void> {
        const tsConfigPath = path.join(project.path, "tsconfig.json");
        const parsedCommandLine = typescript.getParsedCommandLineOfConfigFile(
            tsConfigPath,
            typescriptOptions,
            {
                useCaseSensitiveFileNames: typescript.sys.useCaseSensitiveFileNames,
                readFile: typescript.sys.readFile,
                readDirectory: typescript.sys.readDirectory,
                fileExists: typescript.sys.fileExists,
                getCurrentDirectory: typescript.sys.getCurrentDirectory,
                onUnRecoverableConfigFileDiagnostic: diagnostic => console.error("Config error:", diagnostic.messageText)
            }
        );

        if (!parsedCommandLine) {
            Console.writeLineError("Failed to parse tsconfig.json");
            return process.exit(1);
        }

        const externalExtensions = await ExtensionsResolver.resolveAsync(transformers, project.path);
        const program = typescript.createProgram({ rootNames: parsedCommandLine.fileNames, options: parsedCommandLine.options });
        const externalTransformers = externalExtensions.map(ext => ext.getTransformers(program));
        const mergedTransformers = { before: externalTransformers.flatMap(t => t.before ?? []), after: externalTransformers.flatMap(t => t.after ?? []) };
        const hasTransformers = mergedTransformers.before.length > 0 || mergedTransformers.after.length > 0;

        const result = Compiler.compile(project.path, {
            typescriptOptions: parsedCommandLine.options,
            transformers: hasTransformers ? mergedTransformers : undefined
        });

        for (const diagnostic of result.diagnostics)
            this.processDiagnostics(project, [diagnostic]);

        if (!result.success)
            return process.exit(1);
    }
}