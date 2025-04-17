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
import { CommandsService } from "../../../src/services/commands/commands.service.ts";

test('CommandsService: parse - success', (context: TestContext) => {

    process.argv = [StringExtensions.empty, StringExtensions.empty];
    let command = CommandsService.parse();
    context.assert.equal(command.type, CommandType.Ctx);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'new'];
    command = CommandsService.parse();
    context.assert.equal(command.type, CommandType.New);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'build'];
    command = CommandsService.parse();
    context.assert.equal(command.type, CommandType.Build);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'watch'];
    command = CommandsService.parse();
    context.assert.equal(command.type, CommandType.Watch);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'version'];
    command = CommandsService.parse();
    context.assert.equal(command.type, CommandType.Version);
});

test('CommandsService: parse - no arguments', (context: TestContext) => {
    process.argv = [];
    const command = CommandsService.parse();

    context.assert.equal(command.type, CommandType.Ctx);
});

test('CommandsService: parse - invalid command', (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'invalid'];

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        CommandsService.parse();
    } catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(logOutput, /Invalid command provided\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});