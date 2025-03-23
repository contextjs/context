/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { execSync } from "node:child_process";
import fs from 'node:fs';
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class BuildCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === 'p');
        const projectDescriptors = this.getProjectDescriptors(projectCommand?.values || []);

        if (projectDescriptors.length === 0) {
            console.error('No projects found. Exiting...');
            return process.exit(1);
        }

        projectDescriptors.forEach(projectDescriptor => {
            this.build(projectDescriptor);
        });

        return process.exit(0);
    }

    private build(projectDescriptor: Project): void {
        console.log(`Building project: "${projectDescriptor.name}"...`);

        if (!File.exists(`${projectDescriptor.path}/context.json`)) {
            console.error('No project file found. Exiting...');
            return process.exit(1);
        }

        if (!File.exists(`${projectDescriptor.path}/tsconfig.json`)) {
            console.error('No tsconfig.json file found. Exiting...');
            return process.exit(1);
        }

        try {
            execSync(`tsc`, { stdio: 'inherit' });
            this.copyFiles(projectDescriptor);
            console.log(`Project "${projectDescriptor.name}" built successfully.`);
        }
        catch {
            console.error(`Error building project "${projectDescriptor.name}".`);
            return process.exit(1);
        }
    }

    private copyFiles(projectDescriptor: Project) {
        const contextFileContent = File.read(`${projectDescriptor.path}/context.json`);
        if (!contextFileContent) {
            console.error('No context file found. Exiting...');
            return process.exit(1);
        }
        const contextJson = JSON.parse(contextFileContent);

        if (contextJson.files && contextJson.files.length > 0) {
            contextJson.files.forEach((file: any) => {
                try {
                    if (!fs.existsSync(`${projectDescriptor.path}/${file.from}`)) {
                        console.error(`File "${file.from}" not found. Exiting...`);
                        return process.exit(1);
                    }
                    fs.cpSync(`${projectDescriptor.path}/${file.from}`, `${projectDescriptor.path}/${file.to}`);
                }
                catch (error: any) {
                    console.error(`Error copying file "${file}".`);
                    console.error(error);
                    return process.exit(1);
                }
            });
        }
    }
}