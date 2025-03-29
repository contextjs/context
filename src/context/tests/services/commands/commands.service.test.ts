/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/system';
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
    const originalLog = console.log;
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'invalid'];

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => { exitCode = code; return undefined as never; };

    CommandsService.parse();

    context.assert.strictEqual(logOutput, 'Invalid command provided. Exiting...');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

