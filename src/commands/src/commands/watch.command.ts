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
    return new WatchCommand().runAsync(context);
}

export class WatchCommand extends CommandBase {
    public async runAsync(context: ICommandContext): Promise<void> {
        const projects = this.getProjects(context, [process.cwd()]);

        if (projects.length === 0) {
            Console.writeLineError("No projects found. Exiting...");
            return process.exit(1);
        }

        const typescriptOptions = Compiler.parseTypescriptArguments(context.parsedArguments);
        this.appendCLICompilerExtensions(context);

        await Promise.all(projects.map(project => this.watchAsync(project, context, typescriptOptions)));
    }

    private async watchAsync(project: Project, context: ICommandContext, typescriptOptions: typescript.CompilerOptions): Promise<void> {
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

        const projectJson = JSON.parse(File.read(projectFilePath)!);
        const compilerExtensions = projectJson.compilerExtensions;
        if (compilerExtensions && Array.isArray(compilerExtensions) && compilerExtensions.length > 0)
            context.compilerExtensions.push(...compilerExtensions);

        const parsed = typescript.getParsedCommandLineOfConfigFile(
            tsConfigPath,
            typescriptOptions,
            {
                useCaseSensitiveFileNames: typescript.sys.useCaseSensitiveFileNames,
                readDirectory: typescript.sys.readDirectory,
                fileExists: typescript.sys.fileExists,
                readFile: typescript.sys.readFile,
                getCurrentDirectory: typescript.sys.getCurrentDirectory,
                onUnRecoverableConfigFileDiagnostic: diagnostic => Console.writeLineError(`tsconfig parse error: ${diagnostic.messageText}`)
            }
        );
        if (!parsed) {
            Console.writeLineError("Failed to parse tsconfig.json for watch.");
            return process.exit(1);
        }

        const program = typescript.createProgram({ rootNames: parsed.fileNames, options: parsed.options });

        Compiler.watch(project.path, {
            typescriptOptions: parsed.options,
            transformers: await this.getTransformersAsync(context, program),
            onDiagnostic: diagnostic => this.processDiagnostics(project, [diagnostic])
        });
    }
}