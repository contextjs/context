/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { BufferExtensions } from '../../src/extensions/buffer.extensions.js';

test('BufferExtensions.create: returns a Buffer instance', (context: TestContext) => {
    const buffer = BufferExtensions.create('test');

    context.assert.ok(Buffer.isBuffer(buffer));
});

test('BufferExtensions.create: default ascii encoding', (context: TestContext) => {
    const input = 'ABCxyz123';
    const buffer = BufferExtensions.create(input);
    const expected = Buffer.from(input, 'ascii');

    context.assert.deepStrictEqual(buffer, expected);
});

test('BufferExtensions.create: utf8 encoding support', (context: TestContext) => {
    const input = 'πλμ';
    const buffer = BufferExtensions.create(input, 'utf8');
    const expected = Buffer.from(input, 'utf8');

    context.assert.deepStrictEqual(buffer, expected);
});
