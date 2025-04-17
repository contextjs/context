/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, StringExtensions } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { VersionCommand } from "../../../src/services/commands/version.command.ts";

test('VersionCommand: runAsync - success', async (context: TestContext) => {
    const command = new Command(CommandType.Version, []);
    const versionCommand = new VersionCommand();
    let consoleText = StringExtensions.empty;

    const originalOutput = Console['output'];
    Console.setOutput((...args: any[]) => {
        consoleText += args.map(arg => String(arg)).join(' ') + '\n';
    });

    await versionCommand.runAsync(command);

    context.assert.match(consoleText, /ContextJS/);

    Console.setOutput(originalOutput);
});