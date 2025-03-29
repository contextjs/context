/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument, StringExtensions } from "@contextjs/core";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { CtxCommand } from "../../../src/services/commands/ctx.command.ts";

test('ContextCommand: runAsync - success', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    console.log = (message: string) => logOutput = message;
    const consoleArguments: ConsoleArgument[] = [];
    const command = new Command(CommandType.Ctx, consoleArguments);
    const contextCommand = new CtxCommand();

    await contextCommand.runAsync(command);

    context.assert.strictEqual(logOutput, 'Usage: ctx [options]\n\nOptions:\n    new     creates a new project or solution\n');
});