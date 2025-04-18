/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/system';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { TestContext, after } from 'node:test';
import { File } from '../../src/path/file.ts';

const base = fs.mkdtempSync(path.join(os.tmpdir(), 'contextjs-file-'));

after(() => {
    if (fs.existsSync(base))
        fs.rmSync(base, { recursive: true, force: true });
});

test('File: read - success', (context: TestContext) => {
    const file = path.join(base, 'read.txt');
    File.save(file, 'content', true);
    context.assert.strictEqual(File.read(file), 'content');
});

test('File: read - throws FileNotFoundException', (context: TestContext) => {
    const file = path.join(base, 'not-found.txt');
    context.assert.throws(() => File.read(file));
});

test('File: save - success', (context: TestContext) => {
    const file = path.join(base, 'save.txt');
    const result = File.save(file, 'content');
    context.assert.strictEqual(result, true);
});

test('File: save - success - directory create', (context: TestContext) => {
    const file = path.join(base, 'nested/save.txt');
    const result = File.save(file, 'content');
    context.assert.strictEqual(result, true);
});

test('File: save - success overwrite', (context: TestContext) => {
    const file = path.join(base, 'overwrite.txt');
    File.save(file, 'original');
    const result = File.save(file, 'new', true);
    context.assert.strictEqual(result, true);
});

test('File: save - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.save(StringExtensions.empty, 'content'));
});

test('File: save - throws FileExistsException', (context: TestContext) => {
    const file = path.join(base, 'exists.txt');
    File.save(file, 'content');
    context.assert.throws(() => File.save(file, 'duplicate'));
});

test('File: rename - success', (context: TestContext) => {
    const oldFile = path.join(base, 'old.txt');
    const newFile = path.join(base, 'new.txt');
    File.save(oldFile, 'content');
    const result = File.rename(oldFile, newFile);
    context.assert.strictEqual(result, true);
});

test('File: rename - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.rename(StringExtensions.empty, 'new.txt'));
    context.assert.throws(() => File.rename('old.txt', StringExtensions.empty));
});

test('File: rename - throws FileNotFoundException', (context: TestContext) => {
    const oldFile = path.join(base, 'missing-old.txt');
    const newFile = path.join(base, 'missing-new.txt');
    context.assert.throws(() => File.rename(oldFile, newFile));
});

test('File: rename - throws FileExistsException', (context: TestContext) => {
    const oldFile = path.join(base, 'rename-old.txt');
    const newFile = path.join(base, 'rename-new.txt');
    File.save(oldFile, 'a');
    File.save(newFile, 'b');
    context.assert.throws(() => File.rename(oldFile, newFile));
});

test('File: delete - success', (context: TestContext) => {
    const file = path.join(base, 'delete.txt');
    File.save(file, 'content');
    context.assert.strictEqual(File.delete(file), true);
});

test('File: delete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => File.delete(StringExtensions.empty));
});

test('File: delete - file not found', (context: TestContext) => {
    const file = path.join(base, 'missing.txt');
    context.assert.strictEqual(File.delete(file), false);
});

test('File: exists - success', (context: TestContext) => {
    const file = path.join(base, 'exists-check.txt');
    File.save(file, 'hello');
    context.assert.strictEqual(File.exists(file), true);
});