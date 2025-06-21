/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Server, ServerOptions } from "@contextjs/views-language-server";
import { Console, ObjectExtensions } from "@contextjs/system";
import { Command } from "../../models/command.js";

export class LspCommand {
    public async runAsync(command: Command): Promise<void> {
        const stdioArgument = command.args.find(arg => arg.name === "--stdio");
        const languageArgument = command.args.find(arg => arg.name === "--language");

        const language = languageArgument?.values?.[0] || "tshtml";

        if (ObjectExtensions.isNullOrUndefined(stdioArgument)) {
            Console.writeLineError("The --stdio argument is required.");
            process.exit(1);
        }

        const serverOptions = new ServerOptions(true, language);

        Server.start(serverOptions);
    }
}