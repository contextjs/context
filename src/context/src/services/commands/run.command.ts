/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console, ObjectExtensions, StringExtensions } from "@contextjs/system";
import path from "path";
import { pathToFileURL } from "url";
import { Command } from "../../models/command.js";
import { Project } from "../../models/project.js";
import { BuildCommand } from "./build.command.js";
import { CommandBase } from "./command-base.js";

export class RunCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {
        const noBuildCommand = command.args.find(arg => arg.name.toLowerCase() === "--no-build");

        if (ObjectExtensions.isNullOrUndefined(noBuildCommand))
            await new BuildCommand().runAsync(command);

        const projectCommand = command.args.find(arg => arg.name === "project" || arg.name === "-p");
        const projects = this.getProjects(projectCommand?.values || []);

        if (projects.length === 0) {
            Console.writeLineError("No projects found. Exiting...");
            process.exit(1);
        }

        for (const project of projects)
            await this.runProjectAsync(project);
    }

    private async runProjectAsync(project: Project): Promise<void> {
        try {
            const contextFilePath = path.join(project.path, "context.ctxp");
            if (!File.exists(contextFilePath)) {
                Console.writeLineError("No context.ctxp file found. Exiting...");
                process.exit(1);
            }

            const contextJson = JSON.parse(File.read(contextFilePath));
            const mainEntryPath = contextJson.main;
            if (StringExtensions.isNullOrWhitespace(mainEntryPath)) {
                Console.writeLineError("No 'main' entry found in context.ctxp project file.");
                process.exit(1);
            }

            const tsConfigPath = path.join(project.path, "tsconfig.json");
            let mainEntry: string | undefined;
            if (File.exists(tsConfigPath)) {
                try {
                    const tsConfig = JSON.parse(File.read(tsConfigPath));
                    const outDir = tsConfig.compilerOptions?.outDir;
                    if (StringExtensions.isNullOrWhitespace(outDir)) {
                        Console.writeLineError("tsconfig.json is missing 'compilerOptions.outDir'.");
                        process.exit(1);
                    }

                    mainEntry = path.join(project.path, outDir, mainEntryPath.replace(/\.ts$/, ".js"));
                }
                catch {
                    Console.writeLineError("Failed to parse tsconfig.json.");
                    process.exit(1);
                }
            }
            else {
                Console.writeLineError("No tsconfig.json found.");
                process.exit(1);
            }

            if (StringExtensions.isNullOrWhitespace(mainEntry) || !File.exists(mainEntry)) {
                Console.writeLineError(`Compiled entry file "${mainEntry}" not found. Did you run 'ctx build'?`);
                process.exit(1);
            }

            Console.writeLine(`Running project "${project.name}"...`);

            const extraArgsIndex = process.argv.indexOf("--");
            const extraArgs = extraArgsIndex !== -1 ? process.argv.slice(extraArgsIndex + 1) : [];
            process.argv = [mainEntry, ...extraArgs];
            process.env['CTX_ENTRY_FILE'] = path.resolve(mainEntry);

            await import(pathToFileURL(path.resolve(mainEntry)).href);
        }
        catch (error: any) {
            Console.writeLineError(`Error running project "${project.name}":`);
            Console.writeLineError(error && error.stack || error);
            process.exit(1);
        }
    }
}