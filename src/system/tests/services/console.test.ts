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
import { Console } from "../../src/services/console.ts";

test('Console: parseArguments - success', (context: TestContext) => {
    const args = ['--name', 'value', 'value2', '--age', '25', '--isTrue', 'true'];
    const result = Console.parseArguments(args);

    context.assert.strictEqual(result.length, 3);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[1].name, '--age');
    context.assert.strictEqual(result[1].values[0], '25');
    context.assert.strictEqual(result[2].name, '--isTrue');
    context.assert.strictEqual(result[2].values[0], 'true');
});

test('Console: parseArguments - empty', (context: TestContext) => {
    const args: string[] = [];
    const result = Console.parseArguments(args);

    context.assert.strictEqual(result.length, 0);
});

test('Console: parseArguments - no values', (context: TestContext) => {
    const args = ['--name'];
    const result = Console.parseArguments(args);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values.length, 0);
});

test('Console: parseArguments - duplicate argument', (context: TestContext) => {
    const args = ['--name', 'value', '--name', 'value2'];
    const result = Console.parseArguments(args);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].name, '--name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[0].values.length, 2);
});

test('Console: writeLineError - success', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output = message);

    Console.writeLineError('test');
    context.assert.strictEqual(output, '\x1b[31mtest\x1b[39m');

    Console.resetOutput();
});

test('Console: writeLineWarning - success', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output = message);

    Console.writeLineWarning('test');
    context.assert.strictEqual(output, '\x1b[33mtest\x1b[39m');

    Console.resetOutput();
});

test('Console: writeLineInfo - success', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output = message);

    Console.writeLineInfo('test');
    context.assert.strictEqual(output, '\x1b[34mtest\x1b[39m');

    Console.resetOutput();
});

test('Console: writeLineSuccess - success', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output = message);

    Console.writeLineSuccess('test');
    context.assert.strictEqual(output, '\x1b[32mtest\x1b[39m');

    Console.resetOutput();
});

test('Console: writeLine - success', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output = message);

    Console.writeLine('test');
    context.assert.strictEqual(output, 'test');

    Console.resetOutput();
});

test('Console: removeLastLine - success', (context: TestContext) => {
    let capturedOutput = StringExtensions.empty;

    process.stdout.write = (data: string) => {
        capturedOutput += data;
        return true;
    };

    readline.clearLine = () => {
        capturedOutput = capturedOutput.replace('line2', '');
        return true;
    };

    Console.writeLine('line1');
    Console.writeLine('line2');
    Console.writeLine('line3');
    Console.removeLastLine();

    context.assert.doesNotMatch(capturedOutput, /line2/);
});

test('Console: parseArguments - handles --key=value format', (context: TestContext) => {
    const args = ['--target=ES2022', '--strict'];
    const result = Console.parseArguments(args);

    context.assert.strictEqual(result.length, 2);
    context.assert.strictEqual(result[0].name, '--target');
    context.assert.deepStrictEqual(result[0].values, ['ES2022']);
    context.assert.strictEqual(result[1].name, '--strict');
    context.assert.deepStrictEqual(result[1].values, []);
});