/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CommandType } from "../../src/models/command-type.js";

test("CommandType: enum has all expected values", (context: TestContext) => {
    context.assert.equal(CommandType.Ctx, 0);
    context.assert.equal(CommandType.New, 1);
    context.assert.equal(CommandType.Build, 2);
    context.assert.equal(CommandType.Run, 3);
    context.assert.equal(CommandType.Restore, 4);
    context.assert.equal(CommandType.Watch, 5);
    context.assert.equal(CommandType.Version, 6);
});

test("CommandType: enum can map numeric values back to names", (context: TestContext) => {
    context.assert.equal(CommandType[0], "Ctx");
    context.assert.equal(CommandType[1], "New");
    context.assert.equal(CommandType[2], "Build");
    context.assert.equal(CommandType[3], "Run");
    context.assert.equal(CommandType[4], "Restore");
    context.assert.equal(CommandType[5], "Watch");
    context.assert.equal(CommandType[6], "Version");
});