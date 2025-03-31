/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { File } from '../../src/path/file.ts';
import { Directory } from '@contextjs/io';

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
    const result = File.save(file, 'content');

    context.assert.strictEqual(result, true);

    File.delete(file);
});

test('File: save - success - directory create', (context: TestContext) => {
    const file = 'dir/file.txt';
    const result = File.save(file, 'content');

    context.assert.strictEqual(result, true);

    File.delete(file);
    Directory.delete('dir');
});

test('File: save - success overwrite', (context: TestContext) => {
    const file = 'file.txt';
    const result = File.save(file, 'content', true);

    context.assert.strictEqual(result, true);

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

test('File: rename - success', (context: TestContext) => {
    const oldName = 'old-name.txt';
    const newName = 'new-name.txt';
    File.save(oldName, 'content');
    const result = File.rename(oldName, newName);

    context.assert.strictEqual(result, true);

    File.delete(newName);
});

test('File: rename - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.rename(StringExtensions.empty, 'new-file.txt'));
    context.assert.throws(() => File.rename('old-file.txt', StringExtensions.empty));
});

test('File: rename - throws PathNotFoundException', (context: TestContext) => {
    context.assert.throws(() => File.rename('old-name.txt', 'new-name.txt'));
});

test('File: rename - path exists', (context: TestContext) => {
    const oldName = 'old-name.txt';
    const newName = 'new-name.txt';
    File.save(oldName, 'content1');
    File.save(newName, 'content2');

    context.assert.throws(() => File.rename(oldName, newName));

    File.delete(oldName);
    File.delete(newName);
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