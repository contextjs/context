/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import fs from 'node:fs';
import path from "node:path";
import typescript from 'typescript';
import { Command } from "../../../models/command.js";
import { Project } from "../../../models/project.js";
import { CommandBase } from "../command-base.js";
import { TransformersService } from "./transformers/transformers.service.js";

export class BuildCommand extends CommandBase {
    public override async runAsync(command: Command): Promise<void> {
        const projectCommand = command.args.find(arg => arg.name === 'project' || arg.name === 'p');
        const projects = this.getProjects(projectCommand?.values || []);

        if (projects.length === 0) {
            Console.writeLineError('No projects found. Exiting...');
            return process.exit(1);
        }

        await Promise.all(projects.map(project => this.buildAsync(project)));

        return process.exit(0);
    }

    private async buildAsync(project: Project): Promise<void> {
        try {
            Console.writeLine(`Building project: "${project.name}"...`);

            if (!File.exists(`${project.path}/context.ctxp`)) {
                Console.writeLineError('No context file found. Exiting...');
                return process.exit(1);
            }

            if (!File.exists(`${project.path}/tsconfig.json`)) {
                Console.writeLineError('No tsconfig.json file found. Exiting...');
                return process.exit(1);
            }

            await this.compileAsync(project);

            this.copyFiles(project);
            Console.writeLineSuccess(`Project "${project.name}" built successfully.`);
        }
        catch(error: any) {
            Console.writeLineError(`Error building project "${project.name}".`);
            console.log(error);
            return process.exit(1);
        }
    }

    private copyFiles(project: Project) {
        const contextFileContent = File.read(`${project.path}/context.ctxp`);
        if (!contextFileContent) {
            Console.writeLineError('No context file found. Exiting...');
            return process.exit(1);
        }
        const contextJson = JSON.parse(contextFileContent);

        if (contextJson.files && contextJson.files.length > 0) {
            contextJson.files.forEach((file: any) => {
                try {
                    if (!fs.existsSync(`${project.path}/${file.from}`)) {
                        Console.writeLineError(`File "${file.from}" not found. Exiting...`);
                        return process.exit(1);
                    }
                    fs.cpSync(`${project.path}/${file.from}`, `${project.path}/${file.to}`);
                }
                catch (error: any) {
                    Console.writeLineError(`Error copying file "${file.from}" to "${file.to}".`);
                    Console.writeLineError(error);
                    return process.exit(1);
                }
            });
        }
    }

    private async compileAsync(project: Project): Promise<void> {
        const filesDirectory = `${project.path}/src`;
        const files = fs.readdirSync(filesDirectory, { recursive: true });
        const filePaths: string[] = [];

        for (const file of files) {
            const filePath = `${filesDirectory}/${file}`;
            if (filePath.endsWith('.ts'))
                filePaths.push(filePath);
        }

        const tsConfigFile = typescript.readConfigFile(`${project.path}/tsconfig.json`, typescript.sys.readFile);
        const parsedConfig = typescript.parseJsonConfigFileContent(tsConfigFile.config, typescript.sys, project.path);
        const program = typescript.createProgram(filePaths, parsedConfig.options);
        const emitResult = program.emit(undefined, undefined, undefined, undefined, { before: TransformersService.transformers });

        if (emitResult.diagnostics.length > 0) {
            emitResult.diagnostics.forEach(diagnostic => {
                const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                const { line, character } = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start!) || {};
                Console.writeLineError(`Error at ${diagnostic.file?.fileName}(${line! + 1},${character! + 1}): ${message}`);
            });
            process.exit(1);
        }
    }
}