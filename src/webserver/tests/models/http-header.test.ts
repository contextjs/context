/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { HttpHeader } from '../../src/models/http-header.js';

test('HttpHeader: constructor assigns name and value', async (context: TestContext) => {
    const header = new HttpHeader('Content-Type', 'application/json');
    context.assert.strictEqual(header.name, 'Content-Type');
    context.assert.strictEqual(header.value, 'application/json');
});

test('HttpHeader: throws if name is null or whitespace', async (context: TestContext) => {
    context.assert.throws(() => new HttpHeader('', 'value'), NullReferenceException);
    context.assert.throws(() => new HttpHeader('   ', 'value'), NullReferenceException);
});

test('HttpHeader: throws if value is null or undefined', async (context: TestContext) => {
    context.assert.throws(() => new HttpHeader('X-Test', null as any), NullReferenceException);
    context.assert.throws(() => new HttpHeader('X-Test', undefined as any), NullReferenceException);
});