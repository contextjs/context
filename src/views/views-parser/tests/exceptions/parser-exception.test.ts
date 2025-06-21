/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";
import test, { TestContext } from 'node:test';
import { ParserException } from "../../src/exceptions/parser.exception.js";

test('ParserException: instance - success', (context: TestContext) => {
    const exception = new ParserException("Test Parser Exception");

    context.assert.ok(exception instanceof ParserException);
    context.assert.ok(exception instanceof SystemException);
    context.assert.ok(exception instanceof Error);
});

test('ParserException: name - success', (context: TestContext) => {
    const exception = new ParserException("Test Parser Exception");

    context.assert.strictEqual(exception.name, "ParserException");
});

test('ParserException: message - success', (context: TestContext) => {
    const exception = new ParserException("Test Parser Exception");

    context.assert.strictEqual(exception.message, "Test Parser Exception");
});

test('ParserException: toString - success', (context: TestContext) => {
    const exception = new ParserException("Test Parser Exception");

    context.assert.strictEqual(exception.toString(), "ParserException: Test Parser Exception");
});

test('ParserException: supports cause', (context: TestContext) => {
    const original = new Error("Original cause");
    const exception = new ParserException("With cause");
    exception.cause = original;

    context.assert.strictEqual(exception.cause, original);
});
