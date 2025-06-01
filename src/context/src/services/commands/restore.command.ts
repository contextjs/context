/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import { execSync } from "node:child_process";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { CommandBase } from "./command-base.js";

export class RestoreCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === '-p');
        const projects = this.getProjects(projectCommand?.values || []);

        if (projects.length === 0) {
            Console.writeLineError('No projects found. Exiting...');
            return process.exit(1);
        }

        await Promise.all(projects.map(project => this.restoreAsync(project)));
    }

    private async restoreAsync(project: Project): Promise<void> {
        Console.writeLine(`Restoring project: "${project.name}"...`);

        if (!File.exists(`${project.path}/context.ctxp`)) {
            Console.writeLineError('No context file found. Exiting...');
            return process.exit(1);
        }

        if (!File.exists(`${project.path}/tsconfig.json`)) {
            Console.writeLineError('No tsconfig.json file found. Exiting...');
            return process.exit(1);
        }

        try {
            execSync(`cd ${project.path} && npm update && cd ..`, { stdio: 'inherit' });
            Console.writeLineSuccess(`Project "${project.name}" restored successfully.`);
        }
        catch {
            Console.writeLineError(`Error restoring project "${project.name}".`);
            return process.exit(1);
        }
    }
}