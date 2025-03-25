/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CommandType, CommandTypeExtensions } from "../../src/models/command-type.ts";

test('CommandType: length - success', (context: TestContext) => {
    context.assert.strictEqual(Object.keys(CommandType).length / 2, 5);
});

test('CommandTypeMethods: fromString - success', (context: TestContext) => {

    let command = 'build';
    let result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, CommandType.Build);

    command = 'watch';
    result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, CommandType.Watch);

    command = 'new';
    result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, CommandType.New);

    command = 'version';
    result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, CommandType.Version);

    command = '';
    result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, null);

    command = 'invalid';
    result = CommandTypeExtensions.fromString(command);
    context.assert.strictEqual(result, null);
});