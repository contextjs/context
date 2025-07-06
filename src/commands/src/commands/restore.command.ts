/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { execSync } from "node:child_process";

import { File } from "@contextjs/io";
import { Console, ICommandContext } from "@contextjs/system";
import { Project } from "../models/project.js";
import { CommandBase } from "./command-base.js";

export async function runAsync(context: ICommandContext) {
    return new RestoreCommand().runAsync(context);
}

export class RestoreCommand extends CommandBase {
    public override async runAsync(context: ICommandContext): Promise<void> {
        const projects = this.getProjects(context, [process.cwd()]);
        if (projects.length === 0) {
            Console.writeLineError('No projects found. Exiting...');
            return process.exit(1);
        }

        await Promise.all(projects.map(project => this.restoreAsync(project)));
    }

    private async restoreAsync(project: Project): Promise<void> {
        Console.writeLine(`Restoring project: "${project.name}"...`);

        if (!File.exists(`${project.path}/context.ctxp`)) {
            Console.writeLineError(`No context.ctxp file found. Exiting...`);
            return process.exit(1);
        }

        if (!File.exists(`${project.path}/tsconfig.json`)) {
            Console.writeLineError('No tsconfig.json file found. Exiting...');
            return process.exit(1);
        }

        try {
            execSync("npm update", { cwd: project.path, stdio: "inherit" });
            Console.writeLineSuccess(`Project "${project.name}" restored successfully.`);
        }
        catch {
            Console.writeLineError(`Error restoring project "${project.name}".`);
            return process.exit(1);
        }
    }
}