/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ObjectExtensions, PathService } from "@contextjs/core";
import { execSync } from "node:child_process";
import { Command } from "../../models/command.mjs";
import { Project } from "../../models/project.mjs";
import { CommandBase } from "./command-base.mjs";

export class RunCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {

        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === 'p');
        const projectDescriptors = this.getProjectDescriptors(projectCommand?.values || []);
        const watchCommand = command.args.find(arg => arg.name === 'watch' || arg.name === 'w');

        if (projectDescriptors.length === 0) {
            console.error('No projects found. Exiting...');
            return process.exit(1);
        }

        projectDescriptors.forEach(projectDescriptor => {
            this.run(projectDescriptor, !ObjectExtensions.isNullOrUndefined(watchCommand));
        });
    }

    private run(projectDescriptor: Project, watch: boolean): void {

        console.log(`Running project: "${projectDescriptor.name}"...`);

        if (!PathService.exists(`${projectDescriptor.path}/context.json`)) {
            console.error('No project file found. Exiting...');
            return process.exit(1);
        }

        if (!PathService.exists(`${projectDescriptor.path}/tsconfig.json`)) {
            console.error('No tsconfig.json file found. Exiting...');
            return process.exit(1);
        }

        const contextFileContent = PathService.fileRead(`${projectDescriptor.path}/context.json`);
        const contextJson = JSON.parse(contextFileContent);
        const mainFile = `${projectDescriptor.path}/${contextJson.main}`;

        if (!PathService.exists(mainFile)) {
            console.error(`Main file "${mainFile}" not found. Exiting...`);
            return process.exit(1);
        }

        try {
            if (watch)
                execSync(`cd ${projectDescriptor.path} && tsx watch ${contextJson.main} && cd ..`, { stdio: 'inherit' });
            else
                execSync(`cd ${projectDescriptor.path} && tsx ${contextJson.main} && cd ..`, { stdio: 'inherit' });
        }
        catch {
            console.error(`Error running project "${projectDescriptor.name}".`);
            return process.exit(1);
        }
    }
}