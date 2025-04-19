/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CommandTypeExtensions } from "../../src/models/command-type-extensions.js";
import { CommandType } from "../../src/models/command-type.js";

test("CommandTypeExtensions: fromString() - returns correct CommandType for full command", (context: TestContext) => {
    context.assert.equal(CommandTypeExtensions.fromString("ctx"), CommandType.Ctx);
    context.assert.equal(CommandTypeExtensions.fromString("new"), CommandType.New);
    context.assert.equal(CommandTypeExtensions.fromString("build"), CommandType.Build);
    context.assert.equal(CommandTypeExtensions.fromString("restore"), CommandType.Restore);
    context.assert.equal(CommandTypeExtensions.fromString("watch"), CommandType.Watch);
    context.assert.equal(CommandTypeExtensions.fromString("version"), CommandType.Version);
});

test("CommandTypeExtensions: fromString() - returns correct CommandType for aliases", (context: TestContext) => {
    context.assert.equal(CommandTypeExtensions.fromString("-n"), CommandType.New);
    context.assert.equal(CommandTypeExtensions.fromString("-b"), CommandType.Build);
    context.assert.equal(CommandTypeExtensions.fromString("-r"), CommandType.Restore);
    context.assert.equal(CommandTypeExtensions.fromString("-w"), CommandType.Watch);
    context.assert.equal(CommandTypeExtensions.fromString("-v"), CommandType.Version);
});

test("CommandTypeExtensions: fromString() - returns null for unknown command", (context: TestContext) => {
    context.assert.equal(CommandTypeExtensions.fromString("unknown"), null);
    context.assert.equal(CommandTypeExtensions.fromString("--invalid"), null);
});

test("CommandTypeExtensions: fromString() - handles case-insensitive input", (context: TestContext) => {
    context.assert.equal(CommandTypeExtensions.fromString("BUILD"), CommandType.Build);
    context.assert.equal(CommandTypeExtensions.fromString("-N"), CommandType.New);
});