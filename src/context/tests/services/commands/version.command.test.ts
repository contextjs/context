/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Command } from "../../../src/models/command.ts";
import { CommandType } from "../../../src/models/command-type.ts";
import { VersionCommand } from "../../../src/services/commands/version.command.ts";
import { StringExtensions } from '@contextjs/core';

test('VersionCommand: runAsync - success', async (context: TestContext) => {
    const command = new Command(CommandType.Version, []);
    const versionCommand = new VersionCommand();
    let consoleText = StringExtensions.empty;

    console.info = (message: string) => {
        consoleText += message;
    };

    await versionCommand.runAsync(command);

    context.assert.match(consoleText, /ContextJS/);
});