/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import readline from 'node:readline';
import test, { TestContext } from 'node:test';
import { CommandType } from "../../src/models/command-type.ts";
import { CLIService } from "../../src/services/cli.service.ts";
import { StringExtensions } from '@contextjs/core';

test('CLIService: parse - success', (context: TestContext) => {

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'new'];
    let command = CLIService.parse();
    context.assert.equal(command.type, CommandType.New);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'build'];
    command = CLIService.parse();
    context.assert.equal(command.type, CommandType.Build);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'watch'];
    command = CLIService.parse();
    context.assert.equal(command.type, CommandType.Watch);

    process.argv = [StringExtensions.empty, StringExtensions.empty, 'version'];
    command = CLIService.parse();
    context.assert.equal(command.type, CommandType.Version);
});

test('CLIService: parse - no arguments', (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [];

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => { exitCode = code; return undefined as never; };

    CLIService.parse();

    context.assert.strictEqual(logOutput, 'No arguments provided. Exiting...');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('CLIService: parse - invalid command', (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'invalid'];

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => { exitCode = code; return undefined as never; };

    CLIService.parse();

    context.assert.strictEqual(logOutput, 'Invalid command provided');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('CLIService: removeLastLine - success', (context: TestContext) => {

    let capturedOutput = StringExtensions.empty;

    process.stdout.write = (data: string) => {
        capturedOutput += data;
        return true;
    };

    readline.clearLine = () => {
        capturedOutput = capturedOutput.replace('line2', '');
        return true;
    };

    process.stdout.write('line1');
    process.stdout.write('line3');
    process.stdout.write('line2');
    CLIService.removeLastLine();

    context.assert.doesNotMatch(capturedOutput, /line2/);
});