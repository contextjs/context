/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ObjectExtensions, PathService, ProjectType, ProjectTypeService, StringExtensions, Throw, VersionService } from "@contextjs/core";
import * as childProcess from "node:child_process";
import readline from "node:readline/promises";
import { Command } from "../../models/command.js";
import { CLIService } from "../cli.service.js";
import { TemplateService } from "../template.service.js";
import { CommandBase } from "./command-base.js";

export class NewCommand extends CommandBase {
    private name: string | null = null;
    private type: ProjectType | null = null;
    private consoleInterface: readline.Interface = readline.createInterface({ input: process.stdin, output: process.stdout });

    public async runAsync(command: Command): Promise<void> {
        if (command.args.length > 0) {
            const nameCommand = command.args.find(arg => arg.name === 'name' || arg.name === 'n');
            if (!ObjectExtensions.isNullOrUndefined(nameCommand))
                this.name = nameCommand!.values[0];

            const typeCommand = command.args.find(arg => arg.name === 'type' || arg.name === 't');
            if (!ObjectExtensions.isNullOrUndefined(typeCommand))
                this.type = ProjectTypeService.fromString(typeCommand!.values[0]);
        }

        this.name = await this.getNameAsync();
        this.type = await this.getProjectTypeAsync();

        if (StringExtensions.isNullOrWhiteSpace(this.name) || ObjectExtensions.isNullOrUndefined(this.type)) {
            console.log('Invalid parameters provided. Exiting...');
            this.consoleInterface.close();
            return process.exit(1);
        }

        this.createProject();
    }

    private async getNameAsync(): Promise<string | null> {
        let name = this.name;

        if (!PathService.directoryIsEmpty(process.cwd())) {
            console.log('The current directory is not empty. Please try again in an empty directory.');
            this.consoleInterface.close();
            return process.exit(1);
        }

        if (StringExtensions.isNullOrWhiteSpace(name)) {
            name = await this.consoleInterface.question('Enter Project Name: ');

            if (StringExtensions.isNullOrWhiteSpace(name)) {
                console.log('Invalid project name provided. Please try again:');
                return await this.getNameAsync();
            }

            return name;
        }

        return name;
    }

    private async getProjectTypeAsync(): Promise<ProjectType | null> {
        let type = this.type;

        if (ObjectExtensions.isNullOrUndefined(type)) {
            console.log('Project Type:');

            ProjectTypeService.toCLIOptions().forEach((option) => {
                console.log(`   ${option}`);
            });

            const typeAnswer = await this.consoleInterface.question('Choose the Project Type: ');
            type = ProjectTypeService.fromNumber(+typeAnswer);
            if (ObjectExtensions.isNullOrUndefined(type)) {
                console.log('Invalid Project Type provided. Please try again:');
                return await this.getProjectTypeAsync();
            }
        }

        return type;
    }

    private createProject(): void {
        Throw.ifNullOrWhiteSpace(this.name);
        Throw.ifNullOrUndefined(this.type);

        this.name = StringExtensions.removeWhiteSpaces(this.name!);

        const loading = CLIService.animate(`Creating Project "${this.name}" (${ProjectTypeService.toString(this.type!)})...`);
        this.createTemplates();

        clearInterval(loading);
        CLIService.removeLastLine();

        console.log(`${ProjectTypeService.toString(this.type!)} "${this.name}" created successfully.`);
        this.consoleInterface.close();

        return process.exit(0);
    }

    private createTemplates(): void {
        if (PathService.exists(this.name!)) {
            console.error(`The Project \"${this.name}\" already exists. Exiting...`);
            this.consoleInterface.close();
            return process.exit(1);
        }

        PathService.directoryDelete(this.name!);
        const lowercaseName = this.name!.toLowerCase();
        const version = VersionService.get();

        TemplateService.fromProjectType(this.type!).forEach(file => {
            if (StringExtensions.isNullOrUndefined(file.content)) {
                PathService.directoryCreate(file.name);
                return;
            }

            file.content = file.content!.replace(/{{name}}/g, lowercaseName);
            file.content = file.content!.replace(/{{version}}/g, version);
            PathService.fileSave(file.name, file.content, true);
        });

        childProcess.execSync(`npm install`, { stdio: 'inherit' });
    }
}