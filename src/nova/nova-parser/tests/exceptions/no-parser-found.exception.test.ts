/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { NoParserFoundException } from "../../src/exceptions/no-parser-found.exception.js";
import { ParserException } from "../../src/exceptions/parser.exception.js";

test('NoParserFoundException: instance - success', (context: TestContext) => {
    const exception = new NoParserFoundException("pyhtml");

    context.assert.ok(exception instanceof NoParserFoundException);
    context.assert.ok(exception instanceof ParserException);
    context.assert.ok(exception instanceof Error);
});

test('NoParserFoundException: name - success', (context: TestContext) => {
    const exception = new NoParserFoundException("pyhtml");

    context.assert.strictEqual(exception.name, "NoParserFoundException");
});

test('NoParserFoundException: message - includes language', (context: TestContext) => {
    const language = "pyhtml";
    const exception = new NoParserFoundException(language);

    context.assert.strictEqual(exception.message, `No parser found for language: ${language}`);
});

test('NoParserFoundException: toString - success', (context: TestContext) => {
    const language = "pyhtml";
    const exception = new NoParserFoundException(language);
    
    context.assert.strictEqual(exception.toString(), `NoParserFoundException: No parser found for language: ${language}`);
});