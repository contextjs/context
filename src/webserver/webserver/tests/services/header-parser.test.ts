/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HeaderParser } from '../../src/services/header-parser.js';

test('HeaderParser.append returns nothing when no header boundary found', (context: TestContext) => {
    const parser = new HeaderParser(1024);
    const result = parser.append(Buffer.from('hello world'));

    context.assert.strictEqual(result.header, undefined);
    context.assert.strictEqual(result.remaining, undefined);
    context.assert.strictEqual(result.overflow, undefined);
});

test('HeaderParser.append returns header and remaining after boundary', (context: TestContext) => {
    const parser = new HeaderParser(1024);
    const raw = 'GET / HTTP/1.1\r\nHost: example.com\r\n\r\nBODY';
    const data = Buffer.from(raw, 'ascii');
    const result = parser.append(data);
    const expectedHeader = Buffer.from('GET / HTTP/1.1\r\nHost: example.com\r\n\r\n', 'ascii');
    const expectedRemaining = Buffer.from('BODY', 'ascii');

    context.assert.ok(result.header!.equals(expectedHeader));
    context.assert.ok(result.remaining!.equals(expectedRemaining));
    context.assert.strictEqual(result.overflow, undefined);
});

test('HeaderParser.append returns overflow when buffer size exceeded', (context: TestContext) => {
    const parser = new HeaderParser(2);
    const result = parser.append(Buffer.from('ABC'));
    context.assert.strictEqual(result.overflow, true);
    context.assert.strictEqual(result.header, undefined);
    context.assert.strictEqual(result.remaining, undefined);
});

test('HeaderParser supports boundary across multiple chunks', (context: TestContext) => {
    const parser = new HeaderParser(1024);
    const part1 = Buffer.from('Line1\r\nLin', 'ascii');
    const result1 = parser.append(part1);
    
    context.assert.strictEqual(result1.header, undefined);
    context.assert.strictEqual(result1.remaining, undefined);

    const part2 = Buffer.from('e2\r\n\r\nDATA', 'ascii');
    const result2 = parser.append(part2);
    const expectedHeader = Buffer.from('Line1\r\nLine2\r\n\r\n', 'ascii');
    const expectedRemaining = Buffer.from('DATA', 'ascii');

    context.assert.ok(result2.header!.equals(expectedHeader));
    context.assert.ok(result2.remaining!.equals(expectedRemaining));
    context.assert.strictEqual(result2.overflow, undefined);
});