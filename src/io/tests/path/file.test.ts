/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/core';
import test, { TestContext } from 'node:test';
import { File } from '../../src/path/file.ts';

test('File: read - success', (context: TestContext) => {
    const file = 'file.txt';
    File.save(file, 'content', true);

    context.assert.strictEqual(File.read(file), 'content');

    File.delete(file);
});

test('File: read - throws FileNotFoundException', (context: TestContext) => {
    context.assert.throws(() => File.read('file.txt'));
});

test('File: save - success', (context: TestContext) => {
    const file = 'file.txt';

    context.assert.strictEqual(File.save(file, 'content'), true);

    File.delete(file);
});

test('File: save - success overwrite', (context: TestContext) => {
    const file = 'file.txt';
    File.save(file, 'content');

    context.assert.strictEqual(File.save(file, 'content', true), true);

    File.delete(file);
});

test('File: save - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.save(StringExtensions.empty, 'content'));
});

test('File: save - throws FileExistsException', (context: TestContext) => {
    const file = 'file.txt';
    File.save(file, 'content');

    context.assert.throws(() => File.save(file, 'content'));

    File.delete(file);
});

test('File: delete - success', (context: TestContext) => {
    const file = 'file.txt';
    File.save(file, 'content');

    context.assert.strictEqual(File.delete(file), true);
});

test('File: delete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.delete(StringExtensions.empty));
});

test('File: delete - file not found', (context: TestContext) => {
    context.assert.strictEqual(File.delete('/file.txt'), false);
});

test('File: exists - success', (context: TestContext) => {
    const file = 'file.txt';
    File.save(file, 'content');

    context.assert.strictEqual(File.exists(file), true);

    File.delete(file);
});