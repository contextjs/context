/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { HttpResponseBuffer } from '../../src/models/http-response-buffer';

test('constructor', (context: TestContext) => {
    const httpResponseBuffer = new HttpResponseBuffer("value");

    context.assert.strictEqual(httpResponseBuffer.value, "value");
    context.assert.strictEqual(httpResponseBuffer.encoding, "utf8");
});