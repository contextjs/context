/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { StreamChunker } from '../../src/models/stream-chunker.js';

test('StreamChunker: encodes a single chunk correctly', async (context: TestContext) => {
    const chunker = new StreamChunker();
    const input = Buffer.from('hello');
    let output = Buffer.alloc(0);

    chunker.on('data', (data: Buffer) => {
        output = Buffer.concat([output, data]);
    });

    const finished = new Promise<void>(resolve => chunker.on('end', resolve));
    chunker.write(input);
    chunker.end();
    await finished;

    const expected = Buffer.concat([
        Buffer.from(input.length.toString(16) + '\r\n', 'ascii'),
        input,
        Buffer.from('\r\n', 'ascii'),
        Buffer.from('0\r\n\r\n', 'ascii'),
    ]);

    context.assert.ok(output.equals(expected), 'Output should match chunked encoding for single chunk');
});

test('StreamChunker: encodes multiple chunks and then flushes zero chunk', async (context: TestContext) => {
    const chunker = new StreamChunker();
    const inputs = [Buffer.from('A'), Buffer.from('BC')];
    let output = Buffer.alloc(0);

    chunker.on('data', (data: Buffer) => {
        output = Buffer.concat([output, data]);
    });

    const finished = new Promise<void>(resolve => chunker.on('end', resolve));
    for (const buf of inputs) {
        chunker.write(buf);
    }
    chunker.end();
    await finished;

    const parts: Buffer[] = [];
    for (const buf of inputs) {
        parts.push(Buffer.from(buf.length.toString(16) + '\r\n', 'ascii'));
        parts.push(buf);
        parts.push(Buffer.from('\r\n', 'ascii'));
    }
    parts.push(Buffer.from('0\r\n\r\n', 'ascii'));
    const expected = Buffer.concat(parts);

    context.assert.ok(output.equals(expected), 'Output should match chunked encoding for multiple chunks');
});