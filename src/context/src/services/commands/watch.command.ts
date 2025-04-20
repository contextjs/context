/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler, ICompilerExtension } from "@contextjs/compiler";
import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import path from "path";
import typescript from "typescript";
import { ExtensionsResolver } from "../../extensions/extensions-resolver.js";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class WatchCommand extends CommandBase {
    public async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === "project" || arg.name === "-p");
        const projects = this.getProjects(projectCommand?.values || []);

        if (projects.length === 0) {
            Console.writeLineError("No projects found. Exiting...");
            return process.exit(1);
        }

        const typescriptOptions = Console.parseTypescriptArguments(command.args);
        const transformersArg = command.args.find(arg => arg.name === "--transformers" || arg.name === "-t");

        await ExtensionsResolver.registerAsync();

        await Promise.all(
            projects.map(project => this.watchAsync(
                project,
                typescriptOptions,
                transformersArg?.values[0].split(",") ?? []
            ))
        );
    }

    private async watchAsync(project: Project, typescriptOptions: typescript.CompilerOptions, externalTransformerPaths: string[]): Promise<void> {
        const contextFilePath = path.join(project.path, "context.ctxp");
        const tsConfigPath = path.join(project.path, "tsconfig.json");

        if (!File.exists(contextFilePath)) {
            Console.writeLineError(`No context file found for "${project.name}". Exiting...`);
            return process.exit(1);
        }

        if (!File.exists(tsConfigPath)) {
            Console.writeLineError(`No tsconfig.json file found for "${project.name}". Exiting...`);
            return process.exit(1);
        }

        const contextJson = JSON.parse(File.read(contextFilePath)!);
        const configuredTransformers = contextJson.compilerOptions?.transformers ?? [];
        const transformers = [...configuredTransformers, ...externalTransformerPaths];

        const resolvedExtensions = await ExtensionsResolver.resolveAsync(transformers, project.path);

        Compiler.watch(project.path, {
            typescriptOptions,
            transformers: this.mergeTransformers(resolvedExtensions),
            onDiagnostic: diagnostic => this.processDiagnostics(project, [diagnostic])
        });
    }

    private mergeTransformers(resolvedExtensions: ICompilerExtension[]): {
        before: typescript.TransformerFactory<typescript.SourceFile>[];
        after: typescript.TransformerFactory<typescript.SourceFile>[];
    } {
        const program = typescript.createProgram([], {});

        const externalTransformers = resolvedExtensions.map(extension => extension.getTransformers(program));

        return {
            before: externalTransformers.flatMap(t => t.before ?? []),
            after: externalTransformers.flatMap(t => t.after ?? [])
        };
    }
}