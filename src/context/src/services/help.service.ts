/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Console, ICommandContext, ObjectExtensions, StringExtensions } from "@contextjs/system";
import { ICommandManifest } from "../interfaces/i-command-manifest.js";
import { IProviderManifest } from "../interfaces/i-provider-manifest.js";
import { ITemplateManifest } from "../interfaces/i-template-manifest.js";
import { ProviderDiscoveryService } from "./provider-discovery.service.js";

interface ICommandEntry {
    template?: string;
    provider: string;
    description: string;
    help: string;
}

interface ITemplateEntry {
    title: string;
    description: string;
    provider: string;
}

export class HelpService {
    public static display(context: ICommandContext): void {
        const providers = ProviderDiscoveryService.discover();
        if (providers.length === 0) {
            Console.writeLineWarning("No providers found. Please ensure you have installed the necessary ContextJS packages.");
            return;
        }

        const helpArgument = context.parsedArguments[0];

        if (!ObjectExtensions.isNullOrUndefined(helpArgument) &&
            !ObjectExtensions.isNullOrUndefined(helpArgument.values) &&
            !StringExtensions.isNullOrWhitespace(helpArgument.values[0])) {
            const templateName = helpArgument.values[0];

            if (this.displayTemplateHelp(templateName, providers))
                return;
            if (this.displayProviderCommandHelp(templateName, providers))
                return;
            if (this.displayTemplateCommandHelp(templateName, providers))
                return;
        }

        const templates = new Dictionary<string, ITemplateEntry[]>();
        const commands = new Dictionary<string, ICommandEntry[]>();

        for (const provider of providers) {
            for (const [templateKey, template] of provider.templates) {
                if (!templates.has(templateKey))
                    templates.set(templateKey, []);
                templates.get(templateKey)!.push({ title: template.title, description: template.description, provider: provider.name });

                for (const [key, command] of template.commands) {
                    if (!commands.has(key))
                        commands.set(key, []);
                    commands.get(key)!.push({ template: templateKey, provider: provider.name, description: command.description, help: command.help });
                }
            }

            for (const [key, command] of provider.commands) {
                if (!commands.has(key))
                    commands.set(key, []);
                commands.get(key)!.push({ provider: provider.name, description: command.description, help: command.help });
            }
        }

        if (templates.count() === 0)
            Console.writeLineWarning("Templates: none.");
        else {
            Console.writeLine("Templates:");

            for (const [id, entries] of templates)
                for (const entry of entries)
                    Console.writeLineFormatted({ format: ['bold', 'blue'], text: `  ${id}` }, { format: [], text: `- ${entry.description}` });

            Console.writeLine(StringExtensions.empty);
        }

        if (commands.count() === 0)
            Console.writeLineWarning("Commands: none.");
        else {
            Console.writeLine("Commands:");

            for (const [id, entries] of commands)
                for (const entry of entries)
                    Console.writeLineFormatted({ format: ['bold', 'blue'], text: `  ${id}` }, { format: [], text: `- ${entry.description}` });

            Console.writeLine(StringExtensions.empty);
            Console.writeLineWarning("Type 'ctx --help <template|command>' or 'ctx -h <template|command>' for details.");
            Console.writeLine(StringExtensions.empty);
        }
    }

    private static displayTemplateHelp(templateName: string, providers: IProviderManifest[]): boolean {
        let foundTemplate = false;

        for (const provider of providers) {
            if (!provider.templates.has(templateName))
                continue;

            foundTemplate = true;
            const template = provider.templates.get(templateName) as ITemplateManifest;
            Console.writeLineFormatted({ format: ['bold', 'blue'], text: `Template: ${templateName}` }, { format: [], text: `(${template.title})` });
            Console.writeLine(`  ${template.description}`);
            Console.writeLine(StringExtensions.empty);

            Console.writeLine("  Commands:");
            for (const [key, command] of template.commands as Dictionary<string, ICommandManifest>) {
                Console.writeLineFormatted({ format: ['bold', 'blue'], text: `    ${key}` }, { format: [], text: `- ${command.description}` });
                Console.writeLine(`    ${command.help}`);
            }
            Console.writeLine(StringExtensions.empty);
        }

        return foundTemplate;
    }

    private static displayProviderCommandHelp(commandName: string, providers: IProviderManifest[]): boolean {
        let foundCommand = false;

        for (const provider of providers) {
            if (!provider.commands.has(commandName))
                continue;

            foundCommand = true;
            const command = provider.commands.get(commandName) as ICommandManifest;
            Console.writeLineInfo(`Command: ${commandName}`);
            Console.writeLine(`  ${command.description}`);
            Console.writeLine(`  ${command.help}`);
            Console.writeLine(StringExtensions.empty);
        }

        return foundCommand;
    }

    private static displayTemplateCommandHelp(commandName: string, providers: IProviderManifest[]): boolean {
        let foundCommand = false;

        for (const provider of providers) {
            for (const [templateKey, template] of provider.templates as Dictionary<string, ITemplateManifest>) {
                if (!template.commands.has(commandName))
                    continue;

                foundCommand = true;
                const command = template.commands.get(commandName) as ICommandManifest;
                Console.writeLineInfo(`Command: ${commandName} (${templateKey})`);
                Console.writeLine(`  ${command.description}`);
                Console.writeLine(`  ${command.help}`);
                Console.writeLine(StringExtensions.empty);
            }
        }

        return foundCommand;
    }
}