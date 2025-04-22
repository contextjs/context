/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { HttpResponseBuffer } from '../../src/models/http-response-buffer';

test('HttpResponseBuffer: constructor - success', (context: TestContext) => {
    const httpResponseBuffer = new HttpResponseBuffer("value");

    context.assert.strictEqual(httpResponseBuffer.value, "value");
    context.assert.strictEqual(httpResponseBuffer.encoding, "utf8");
});

test('HttpResponseBuffer: assigns value and default encoding', async (context: TestContext) => {
    const buffer = new HttpResponseBuffer('hello');
    context.assert.strictEqual(buffer.value, 'hello');
    context.assert.strictEqual(buffer.encoding, 'utf8');
});

test('HttpResponseBuffer: assigns custom encoding', async (context: TestContext) => {
    const buffer = new HttpResponseBuffer('hello', 'base64');
    context.assert.strictEqual(buffer.encoding, 'base64');
});