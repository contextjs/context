/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import childProcess from "child_process";
import path from "path";

import { Directory, File, Path } from "@contextjs/io";
import { Console, ICommandContext, ObjectExtensions, StringExtensions } from "@contextjs/system";
import { TemplateResolverService } from "./templates/template-resolver.service.js";

export async function runAsync(context: ICommandContext) {
    return new NewCommand().runAsync(context);
}

export class NewCommand {
    public async runAsync(context: ICommandContext): Promise<void> {
        if (context.parsedArguments.length === 0) {
            Console.writeLineError('No arguments provided. Exiting...');
            return;
        }

        return await this.createTemplateAsync(context);
    }

    private async createTemplateAsync(context: ICommandContext): Promise<void> {
        const type = context.parsedArguments[0].values[0]?.toLowerCase();
        if (StringExtensions.isNullOrWhitespace(type)) {
            Console.writeLineError(`No project type provided. Please specify a project type.`);
            return process.exit(1);
        }

        const templateService = await TemplateResolverService.resolveAsync(type);
        if (ObjectExtensions.isNullOrUndefined(templateService)) {
            Console.writeLineError(`The project type "${type}" is not supported.`);
            return process.exit(1);
        }

        const name = await this.getNameAsync(context);

        if (Path.exists(name)) {
            Console.writeLineError(`The Project or folder \"${name}\" already exists (case-insensitive match). Exiting...`);
            return process.exit(1);
        }

        Console.writeLineFormatted({ format: 'green', text: `Creating project \"${name}\"...` });

        templateService!.templates.forEach(file => {
            if (StringExtensions.isNullOrUndefined(file.content)) {
                Directory.create(`${name}/${file.name}`);
                return;
            }

            if (file.name === 'package.json')
                file.content = file.content.replace(/{{name}}/g, name.toLowerCase());
            else
                file.content = file.content!.replace(/{{name}}/g, name);
            File.save(`${name}/${file.name}`, file.content, true);
        });

        childProcess.execSync("npm install", { cwd: name, stdio: "inherit" });

        Console.removeLastLine();
        Console.writeLineFormatted({ format: 'green', text: `Creating project \"${name}\"...` }, { format: ['green', 'bold'], text: 'Done.' });
    }

    private async getNameAsync(context: ICommandContext): Promise<string> {
        const nameArgument = context.parsedArguments.find(t => t.name === '--name' || t.name == '-n');
        const result = ObjectExtensions.isNullOrUndefined(nameArgument) || nameArgument.values.length === 0
            ? path.basename(process.cwd())
            : nameArgument.values[0];

        if (/^\d/.test(result)) {
            Console.writeLineError(`The name "${result}" is not valid. It should not start with a number.`);
            return process.exit(1);
        }

        if (/[^a-zA-Z0-9-_]/.test(result)) {
            Console.writeLineError(`The name "${result}" is not valid. It should only contain letters, numbers, dashes and underscores.`);
            return process.exit(1);
        }

        return result.replace(/ /g, '-');
    }
}