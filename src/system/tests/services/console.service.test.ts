/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/system';
import readline from 'node:readline';
import test, { TestContext } from 'node:test';
import { ConsoleService } from "../../src/services/console.service.ts";

test('ConsoleService: parseArguments - success', (context: TestContext) => {
    const args = ['--name', 'value', 'value2', '--age', '25', '--isTrue', 'true'];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 3);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[1].name, '--age');
    context.assert.strictEqual(result[1].values[0], '25');
    context.assert.strictEqual(result[2].name, '--isTrue');
    context.assert.strictEqual(result[2].values[0], 'true');
});

test('ConsoleService: parseArguments - empty', (context: TestContext) => {
    const args: string[] = [];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 0);
});

test('ConsoleService: parseArguments - no values', (context: TestContext) => {
    const args = ['--name'];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values.length, 0);
});

test('ConsoleService: parseArguments - duplicate argument', (context: TestContext) => {
    const args = ['--name', 'value', '--name', 'value2'];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[0].values.length, 2);
});

test('ConsoleService: write - success', (context: TestContext) => {
    const originalLog = console.log;
    let logOutput = '';
    console.log = (message: string) => logOutput = message;

    ConsoleService.writeLine('test');

    context.assert.strictEqual(logOutput, 'test');

    console.log = originalLog;
});

test('ConsoleService: removeLastLine - success', (context: TestContext) => {

    let capturedOutput = StringExtensions.empty;

    process.stdout.write = (data: string) => {
        capturedOutput += data;
        return true;
    };

    readline.clearLine = () => {
        capturedOutput = capturedOutput.replace('line2', '');
        return true;
    };

    ConsoleService.writeLine('line1');
    ConsoleService.writeLine('line2');
    ConsoleService.writeLine('line3');
    ConsoleService.removeLastLine();

    context.assert.doesNotMatch(capturedOutput, /line2/);
});