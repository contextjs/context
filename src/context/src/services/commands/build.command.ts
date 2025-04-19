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
import { ExtensionsRegistrar } from "../../extensions/extensions-registrar.js";
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

        await new ExtensionsRegistrar().registerAsync();
        await Promise.all(projects.map(project => this.buildAsync(project)));

        return process.exit(0);
    }

    private async buildAsync(project: Project): Promise<void> {
        try {
            Console.writeLine(`Building project: "${project.name}"...`);

            if (!File.exists(path.join(project.path, "context.ctxp"))) {
                Console.writeLineError("No context file found. Exiting...");
                return process.exit(1);
            }

            if (!File.exists(path.join(project.path, "tsconfig.json"))) {
                Console.writeLineError("No tsconfig.json file found. Exiting...");
                return process.exit(1);
            }

            await this.compileAsync(project);
            this.copyFiles(project);

            Console.writeLineSuccess(`Project "${project.name}" built successfully.`);
        }
        catch {
            Console.writeLineError(`Error building project "${project.name}".`);
            return process.exit(1);
        }
    }

    private copyFiles(project: Project): void {
        const contextFilePath = path.join(project.path, "context.ctxp");
        const contextFileContent = File.read(contextFilePath);

        if (!contextFileContent) {
            Console.writeLineError("No context file found. Exiting...");
            return process.exit(1);
        }

        const contextJson = JSON.parse(contextFileContent);

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

    private async compileAsync(project: Project): Promise<void> {
        const result = Compiler.compile(project.path);

        for (const diagnostic of result.diagnostics)
            Console.writeLineError(diagnostic);

        if (!result.success)
            return process.exit(1);
    }
}