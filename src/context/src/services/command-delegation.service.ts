/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { pathToFileURL } from "url";

import { Path } from "@contextjs/io";
import { Console, ICommandContext } from "@contextjs/system";
import { ICommandManifest } from "../interfaces/i-command-manifest.js";
import { IProviderWithRootManifest } from "../interfaces/i-provider-with-root-manifest.js";
import { ProviderDiscoveryService } from "./provider-discovery.service.js";

export class CommandDelegationService {
    public static async delegate(commandContext: ICommandContext): Promise<void> {
        const [commandArgument] = commandContext.parsedArguments;
        if (!commandArgument) {
            Console.writeLineError("No command specified.");
            process.exit(1);
        }

        const commandName = commandArgument.name;
        const providers = ProviderDiscoveryService.discover();
        const matches: { templateKey?: string; provider: IProviderWithRootManifest; command: ICommandManifest; isRoot: boolean }[] = [];

        for (const provider of providers) {
            if (provider.commands.has(commandName))
                matches.push({ provider, command: provider.commands.get(commandName)!, isRoot: true });

            for (const [templateKey, template] of provider.templates)
                if (template.commands.has(commandName))
                    matches.push({ templateKey, provider, command: template.commands.get(commandName)!, isRoot: false });
        }

        if (matches.length === 0) {
            Console.writeLineWarning(`No providers found for command '${commandName}'.`);
            process.exit(1);
        }

        let selected = matches[0];

        if (matches.length > 1) {
            const templateArgument = commandContext.parsedArguments.find(arg => arg.name === "--template" || arg.name === "-t");
            const providerArgument = commandContext.parsedArguments.find(arg => arg.name === "--provider" || arg.name === "-p");

            if (templateArgument)
                selected = matches.find(m => m.templateKey === templateArgument.values[0] && !m.isRoot) ?? selected;
            if (providerArgument)
                selected = matches.find(m => m.provider.name === providerArgument.values[0]) ?? selected;

            const ambiguousMatches = matches.filter(match =>
                (!templateArgument || (match.templateKey === templateArgument.values[0] && !match.isRoot)) &&
                (!providerArgument || match.provider.name === providerArgument.values[0])
            );

            if (ambiguousMatches.length > 1) {
                Console.writeLineWarning(`Multiple handlers found for command '${commandName}':`);

                for (const match of ambiguousMatches)
                    if (match.isRoot)
                        Console.writeLineInfo(`  [provider: ${match.provider.name}] (handler: ${match.command.path})`);
                    else
                        Console.writeLineInfo(`  ${match.templateKey} [${match.provider.name}] (handler: ${match.command.path})`);

                Console.writeLine("Please specify with --template or --provider.");
                process.exit(1);
            }

            if (ambiguousMatches.length === 1)
                selected = ambiguousMatches[0];
        }

        const handlerPath = Path.resolve(selected.provider.root, selected.command.path);
        let handlerModule: any;

        try {
            const handlerUrl = pathToFileURL(handlerPath).href;
            handlerModule = await import(handlerUrl);
        }
        catch (error: any) {
            Console.writeLineError(`Could not load handler at ${handlerPath}: ${error.message}`);
            process.exit(1);
        }

        if (!handlerModule || typeof handlerModule.runAsync !== "function") {
            Console.writeLineError(`Handler for command '${commandName}' does not export a runAsync(context) function.`);
            process.exit(1);
        }

        for (const provider of providers)
            if (provider.compilerExtensions) {
                if (!commandContext.compilerExtensions)
                    commandContext.compilerExtensions = [];
                commandContext.compilerExtensions.push(...provider.compilerExtensions);
            }

        await handlerModule.runAsync(commandContext);
    }
}