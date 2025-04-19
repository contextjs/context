/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, ConsoleArgument, StringExtensions } from "@contextjs/system";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { CtxCommand } from "../../../src/services/commands/ctx.command.ts";

test('CtxCommand: runAsync - success', async (context: TestContext) => {
    const originalOutput = Console['output'];
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    const consoleArguments: ConsoleArgument[] = [];
    const command = new Command(CommandType.Ctx, consoleArguments);
    const contextCommand = new CtxCommand();

    await contextCommand.runAsync(command);

    context.assert.match(logOutput, /Usage: ctx \[options\]/);
    context.assert.match(logOutput, /new\s+creates a new project or solution/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});