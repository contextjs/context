/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CommandType } from "../../src/models/command-type.mjs";
import { Command } from "../../src/models/command.mjs";

test('Command: constructor - success', (context: TestContext) => {
    const args = [];
    const command = new Command(CommandType.Build, args);

    context.assert.strictEqual(command.type, CommandType.Build);
    context.assert.strictEqual(command.args, args);
});