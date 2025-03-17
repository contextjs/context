/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ConsoleService } from "../../src/services/console.service.mjs";

test('ConsoleService: parseArguments - success', (context: TestContext) => {
    const args = ['--name', 'value', 'value2', '--age', '25', '--isTrue', 'true'];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 3);
    context.assert.strictEqual(result[0].name, 'name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[1].name, 'age');
    context.assert.strictEqual(result[1].values[0], '25');
    context.assert.strictEqual(result[2].name, 'isTrue');
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
    context.assert.strictEqual(result[0].name, 'name');
    context.assert.strictEqual(result[0].values.length, 0);
});

test('ConsoleService: parseArguments - failure', (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;
    let logOutput = '';
    let exitCode = 0;
    const args = ['value']

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => { exitCode = code; return undefined as never; };

    ConsoleService.parseArguments(args)

    context.assert.strictEqual(logOutput, 'Argument value provided without argument name');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('ConsoleService: parseArguments - duplicate argument', (context: TestContext) => {
    const args = ['--name', 'value', '--name', 'value2'];
    const result = ConsoleService.parseArguments(args);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].name, 'name');
    context.assert.strictEqual(result[0].values[0], 'value');
    context.assert.strictEqual(result[0].values[1], 'value2');
    context.assert.strictEqual(result[0].values.length, 2);
});