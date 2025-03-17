/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ConsoleArgument } from "../../src/models/console-argument.mjs";

test('ConsoleArgument: instance - success', (context: TestContext) => {
    const argument = new ConsoleArgument('name', ['value1', 'value2']);
    context.assert.ok(argument instanceof ConsoleArgument);
});

test('ConsoleArgument: constructor - success', (context: TestContext) => {
    const argument = new ConsoleArgument('name', ['value1', 'value2']);

    context.assert.strictEqual(argument.name, 'name');
    context.assert.strictEqual(argument.values[0], 'value1');
    context.assert.strictEqual(argument.values[1], 'value2');
});