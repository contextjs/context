/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from "path";
import typescript from "typescript";

import { Compiler } from "@contextjs/compiler";
import { File } from "@contextjs/io";
import { Console, ICommandContext } from "@contextjs/system";
import { Project } from "../models/project.js";
import { CommandBase } from "./command-base.js";

export async function runAsync(context: ICommandContext) {
    return new BuildCommand().runAsync(context);
}

export class BuildCommand extends CommandBase {
    public async runAsync(context: ICommandContext): Promise<void> {
        const projects = this.getProjects(context, [process.cwd()]);
        if (projects.length === 0) {
            Console.writeLineError("No projects found. Exiting...");
            return process.exit(1);
        }

        const typescriptOptions = Compiler.parseTypescriptArguments(context.parsedArguments);
        this.appendCLICompilerExtensions(context);

        await Promise.all(projects.map(project => this.buildAsync(project, context, typescriptOptions)));
    }

    private async buildAsync(project: Project, context: ICommandContext, typescriptOptions: typescript.CompilerOptions): Promise<void> {
        try {
            Console.writeLine(`Building project: "${project.name}"...`);

            const projectFilePath = path.join(project.path, "context.ctxp");
            const tsConfigPath = path.join(project.path, "tsconfig.json");

            if (!File.exists(projectFilePath)) {
                Console.writeLineError("No context.ctxp project file found. Exiting...");
                return process.exit(1);
            }

            if (!File.exists(tsConfigPath)) {
                Console.writeLineError("No tsconfig.json file found. Exiting...");
                return process.exit(1);
            }

            const projectJson = JSON.parse(File.read(projectFilePath));
            const compilerExtensions = projectJson.compilerExtensions;
            if (compilerExtensions && Array.isArray(compilerExtensions) && compilerExtensions.length > 0)
                context.compilerExtensions.push(...compilerExtensions);

            await this.compileAsync(project, context, typescriptOptions);
            this.copyFiles(project, projectJson);

            Console.writeLineSuccess(`Project "${project.name}" built successfully.`);
        }
        catch (error: any) {
            Console.writeLineError(`Error building project "${project.name}".`);
            console.error(error);
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

                    File.copy(sourcePath, targetPath, true);
                }
                catch (error: any) {
                    Console.writeLineError(`Error copying file "${file.from}" to "${file.to}".`);
                    console.error(error);
                    return process.exit(1);
                }
            }
        }
    }

    private async compileAsync(project: Project, context: ICommandContext, typescriptOptions: typescript.CompilerOptions): Promise<void> {
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

        const program = typescript.createProgram({ rootNames: parsedCommandLine.fileNames, options: parsedCommandLine.options });
        const transformers = await this.getTransformersAsync(context, program);

        const result = Compiler.compile(project.path, { typescriptOptions: parsedCommandLine.options, transformers: transformers });

        for (const diagnostic of result.diagnostics)
            this.processDiagnostics(project, [diagnostic]);

        if (!result.success)
            return process.exit(1);
    }
}