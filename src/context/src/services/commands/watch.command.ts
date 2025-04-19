/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { Console } from "@contextjs/system";
import typescript from "typescript";
import { ExtensionsRegistrar } from "../../extensions/extensions-registrar.js";
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

        await new ExtensionsRegistrar().registerAsync();
        await Promise.all(projects.map(project => this.watchAsync(project, typescriptOptions)));
    }

    private async watchAsync(project: Project, typescriptOptions: typescript.CompilerOptions): Promise<void> {
        Console.writeLineInfo(`Watching project "${project.name}" for changes...`);

        Compiler.watch(project.path, {
            typescriptOptions: typescriptOptions,
            onDiagnostic: diagnostic => this.processDiagnostics(project, [diagnostic])
        });
    }
}