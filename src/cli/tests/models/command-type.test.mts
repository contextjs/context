/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CommandType, CommandTypeMethods } from "../../src/models/command-type.mjs";

test('CommandType: length - success', (context: TestContext) => {
    context.assert.strictEqual(Object.keys(CommandType).length / 2, 4);
});

test('CommandTypeMethods: fromString - success', (context: TestContext) => {

    let command = 'build';
    let result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, CommandType.Build);

    command = 'watch';
    result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, CommandType.Watch);

    command = 'new';
    result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, CommandType.New);

    command = 'version';
    result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, CommandType.Version);

    command = '';
    result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, null);

    command = 'invalid';
    result = CommandTypeMethods.fromString(command);
    context.assert.strictEqual(result, null);
});