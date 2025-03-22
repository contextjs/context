/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CommandType } from "../../src/models/command-type.ts";
import { Command } from "../../src/models/command.ts";

test('Command: constructor - success', (context: TestContext) => {
    const args = [];
    const command = new Command(CommandType.Build, args);

    context.assert.strictEqual(command.type, CommandType.Build);
    context.assert.strictEqual(command.args, args);
});