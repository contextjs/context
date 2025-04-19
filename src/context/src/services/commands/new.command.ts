/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File, Path } from "@contextjs/io";
import { Console, ObjectExtensions, ProjectTypeExtensions, StringExtensions, VersionService } from "@contextjs/system";
import childProcess from "child_process";
import path from "path";
import { Command } from "../../models/command.js";
import { TemplatesServiceResolver } from "../templates/templates-service-resolver.js";
import { CommandBase } from "./command-base.js";

export class NewCommand extends CommandBase {
    private readonly helpText = `The "ctx new" command creates a ContextJS project based on a template.
Usage: ctx new [options]

Command         Template Name           Description
--------        ----------------        -----------------------------------------------------
api             Web API project         A Web API project containing controllers and actions.
`;
    public override async runAsync(command: Command): Promise<void> {
        if (command.args.length === 0)
            return await this.displayHelpAsync();

        return await this.createTemplateAsync(command);
    }

    private async createTemplateAsync(command: Command): Promise<void> {
        const type = ProjectTypeExtensions.fromString(command.args[0].name);
        if (ObjectExtensions.isNullOrUndefined(type)) {
            Console.writeLineFormatted({ format: 'red', text: `Invalid project type "${command.args[0].name}".` });
            return process.exit(1);
        }

        const templatesService = await TemplatesServiceResolver.resolveAsync(type!);
        if (ObjectExtensions.isNullOrUndefined(templatesService)) {
            Console.writeLineFormatted({ format: 'red', text: `The project type "${command.args[0].name}" is not supported.` });
            return process.exit(1);
        }

        if (await this.tryDisplayHelpAsync(command, templatesService!))
            return;

        const name = await this.getNameAsync(command);

        if (Path.exists(name)) {
            Console.writeLineFormatted({ format: 'red', text: `The Project \"${name}\" already exists. Exiting...` });
            return process.exit(1);
        }

        Console.writeLineFormatted({ format: 'green', text: `Creating project \"${name}\"...` });

        templatesService!.templates.forEach(file => {
            if (StringExtensions.isNullOrUndefined(file.content)) {
                Directory.create(`${name}/${file.name}`);
                return;
            }

            file.content = file.content!.replace(/{{name}}/g, name);
            File.save(`${name}/${file.name}`, file.content, true);
        });

        childProcess.execSync(`cd ${name} && npm install && cd ..`);
        Console.removeLastLine();
        Console.writeLineFormatted({ format: 'green', text: `Creating project \"${name}\"...` }, { format: ['green', 'bold'], text: 'Done.' });
    }

    private async getNameAsync(command: Command): Promise<string> {
        return (command.args.find(t => t.name === '--name' || t.name == '-n')?.values[0]
            ?? command.args[0].values[0]
            ?? path.basename(process.cwd()))
            .toLowerCase()
            .replace(/ /g, '-');
    }

    private async displayHelpAsync(): Promise<void> {
        VersionService.display();
        Console.writeLine(this.helpText);
        return process.exit(0);
    }
}