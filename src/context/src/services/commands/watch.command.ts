/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class WatchCommand extends CommandBase {
    public async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === 'p');
        const projectDescriptors = this.getProjectDescriptors(projectCommand?.values || []);

        if (projectDescriptors.length === 0) {
            console.error('No projects found. Exiting...');
            return process.exit(1);
        }

        projectDescriptors.forEach(projectDescriptor => {
            this.watchProject(projectDescriptor);
        });
    }

    private watchProject(projectDescriptor: Project) {
        const configPath = typescript.findConfigFile(projectDescriptor.path, typescript.sys.fileExists, "tsconfig.json");
        if (!configPath) {
            console.error("Could not find a valid 'tsconfig.json'.");
            return process.exit(1);
        }

        console.log(`Watching project "${projectDescriptor.name}" for changes...`);

        const createProgram = typescript.createSemanticDiagnosticsBuilderProgram;
        const host = typescript.createWatchCompilerHost(
            configPath,
            undefined,
            typescript.sys,
            createProgram,
            (diagnostic) => this.processDiagnostics(projectDescriptor, [diagnostic]),
            (diagnostic) => this.processDiagnostics(projectDescriptor, [diagnostic])
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