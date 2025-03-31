/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "@contextjs/system";
import typescript from "typescript";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class WatchCommand extends CommandBase {
    public async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === 'p');
        const projectDescriptors = this.getProjects(projectCommand?.values || []);

        if (projectDescriptors.length === 0) {
            Console.writeLineError('No projects found. Exiting...');
            return process.exit(1);
        }

        projectDescriptors.forEach(projectDescriptor => {
            this.watchProject(projectDescriptor);
        });
    }

    private watchProject(project: Project) {
        const configPath = typescript.findConfigFile(project.path, typescript.sys.fileExists, "tsconfig.json");
        if (!configPath) {
            Console.writeLineError(`Could not find a valid 'tsconfig.json' in project "${project.name}".`);
            return process.exit(1);
        }

        Console.writeLineInfo(`Watching project "${project.name}" for changes...`);

        const createProgram = typescript.createSemanticDiagnosticsBuilderProgram;
        const host = typescript.createWatchCompilerHost(
            configPath,
            undefined,
            typescript.sys,
            createProgram,
            (diagnostic) => this.processDiagnostics(project, [diagnostic]),
            (diagnostic) => this.processDiagnostics(project, [diagnostic])
        );

        const originalCreateProgram = host.createProgram;
        host.createProgram = ((
            rootNames: ReadonlyArray<string>,
            options: typescript.CompilerOptions,
            host: typescript.CompilerHost,
            oldProgram: typescript.SemanticDiagnosticsBuilderProgram) => {
            return originalCreateProgram(rootNames, options, host, oldProgram);
        }) as typescript.CreateProgram<typescript.SemanticDiagnosticsBuilderProgram>;

        const originalAfterProgramCreate = host.afterProgramCreate;
        host.afterProgramCreate = program => { originalAfterProgramCreate!(program); };

        return typescript.createWatchProgram(host);
    }
}