/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { UnsupportedPathOperationException } from "../../src/exceptions/unsupported-path-operation.exception.js";

test("UnsupportedPathOperationException: message includes operation", (context: TestContext) => {
    const ex = new UnsupportedPathOperationException("symlink");

    context.assert.ok(ex.message.includes("symlink"));
    context.assert.match(ex.message, /not supported/i);
});

test("UnsupportedPathOperationException: name is set correctly", (context: TestContext) => {
    const ex = new UnsupportedPathOperationException("delete");

    context.assert.strictEqual(ex.name, "UnsupportedPathOperationException");
});

test("UnsupportedPathOperationException: instance of Error and SystemException", (context: TestContext) => {
    const ex = new UnsupportedPathOperationException("move");

    context.assert.ok(ex instanceof Error);
    context.assert.ok(ex instanceof SystemException);
});

test("UnsupportedPathOperationException: stack trace is present", (context: TestContext) => {
    const ex = new UnsupportedPathOperationException("custom");

    context.assert.ok(typeof ex.stack === "string" && ex.stack.length > 0);
});