/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { after, TestContext } from 'node:test';
import { Directory, Path } from '../../src/api';
import { NullReferenceException } from '@contextjs/system';

const base = fs.mkdtempSync(path.join(os.tmpdir(), 'contextjs-io-path-'));

after(() => {
    if (fs.existsSync(base))
        fs.rmSync(base, { recursive: true, force: true });
});

test('Path: exists - success', (context: TestContext) => {
    const dir = path.join(base, 'exists-success');
    Directory.create(dir);

    context.assert.strictEqual(Path.exists(dir), true);

    Directory.delete(dir);
});

test('Path: exists - failure', (context: TestContext) => {
    const dir = path.join(base, 'exists-failure');

    context.assert.strictEqual(Path.exists(dir), false);
});

test('Path: isDirectory - success', (context: TestContext) => {
    const dir = path.join(base, 'is-dir-success');
    Directory.create(dir);

    context.assert.strictEqual(Path.isDirectory(dir), true);

    Directory.delete(dir);
});

test('Path: isDirectory - failure', (context: TestContext) => {
    const dir = path.join(base, 'is-dir-failure');

    context.assert.strictEqual(Path.isDirectory(dir), false);
});

test('Path: isFile - success', (context: TestContext) => {
    const file = path.join(base, 'file.txt');
    fs.writeFileSync(file, 'hello world');

    context.assert.strictEqual(Path.isFile(file), true);

    fs.unlinkSync(file);
});

test('Path: isFile - false when directory', (context: TestContext) => {
    const dir = path.join(base, 'not-a-file');
    Directory.create(dir);

    context.assert.strictEqual(Path.isFile(dir), false);

    Directory.delete(dir);
});

test('Path: isFile - false when not found', (context: TestContext) => {
    const missing = path.join(base, 'missing.txt');

    context.assert.strictEqual(Path.isFile(missing), false);
});

test('Path: normalize - simple normalization (no parent segments)', (context: TestContext) => {
    const input = 'foo/bar/baz.txt';
    const expected = path.normalize(input);

    context.assert.strictEqual(Path.normalize(input), expected);
});

test('Path: normalize - removes leading parent segments', (context: TestContext) => {
    const input = '../../alpha/beta';
    const normalized = path.normalize(input);
    const expected = normalized.replace(/^(\.\.[\/\\])+/, '');

    context.assert.strictEqual(Path.normalize(input), expected);
});

test('Path: normalize - handles mixed "." and ".." segments', (context: TestContext) => {
    const input = '../a/./../b/c.txt';
    const normalized = path.normalize(input);
    const expected = normalized.replace(/^(\.\.[\/\\])+/, '');

    context.assert.strictEqual(Path.normalize(input), expected);
});

test('Path: normalize - preserves absolute paths', (context: TestContext) => {
    const input = '/var//log/../tmp/';
    const expected = path.normalize(input); 

    context.assert.strictEqual(Path.normalize(input), expected);
});

test('Path: normalize - throws on empty or whitespace input', (context: TestContext) => {
    context.assert.throws(() => Path.normalize(''), NullReferenceException);
    context.assert.throws(() => Path.normalize('   '), NullReferenceException);
});

test('Path: join - basic join', (context: TestContext) => {
    const result = Path.join('foo', 'bar', 'baz.txt');
    const expected = path.join('foo', 'bar', 'baz.txt');

    context.assert.strictEqual(result, expected);
});

test('Path: join - normalizes segments', (context: TestContext) => {
    const result = Path.join('foo/', './bar', '../baz', 'qux.txt');
    const expected = path.join('foo', 'bar', 'baz', 'qux.txt');

    context.assert.strictEqual(result, expected);
});

test('Path: join - removes leading parent segments in all', (context: TestContext) => {
    const result = Path.join('../../alpha', '../beta', 'gamma');
    const expected = path.join('alpha', 'beta', 'gamma');

    context.assert.strictEqual(result, expected);
});

test('Path: resolve - resolves absolute path', (context: TestContext) => {
    const result = Path.resolve('/foo', 'bar', 'baz.txt');
    const expected = path.resolve('/foo', 'bar', 'baz.txt');

    context.assert.strictEqual(result, expected);
});

test('Path: resolve - handles mixed relative and absolute', (context: TestContext) => {
    const result = Path.resolve('foo', '../bar', './baz');
    const expected = path.resolve('foo', '../bar', './baz');

    context.assert.strictEqual(result, expected);
});

test('Path: listDirectories - success', (context: TestContext) => {
    const root = path.join(base, 'list-dirs-root');
    const dirA = path.join(root, 'A');
    const dirB = path.join(root, 'B');
    const file = path.join(root, 'file.txt');
    Directory.create(root);
    Directory.create(dirA);
    Directory.create(dirB);
    fs.writeFileSync(file, 'hello');

    const dirs = Path.listDirectories(root);

    context.assert.deepEqual(dirs.sort(), ['A', 'B']);

    fs.unlinkSync(file);
    Directory.delete(dirA);
    Directory.delete(dirB);
    Directory.delete(root);
});

test('Path: listDirectories - throws if not directory', (context: TestContext) => {
    const file = path.join(base, 'not-a-dir.txt');
    fs.writeFileSync(file, 'hi');

    context.assert.throws(() => Path.listDirectories(file), /not a directory/);

    fs.unlinkSync(file);
});

test('Path: listDirectories - throws if missing', (context: TestContext) => {
    const missing = path.join(base, 'missing-folder');

    context.assert.throws(() => Path.listDirectories(missing), /does not exist/);
});

test('Path: listDirectories - throws on empty/whitespace', (context: TestContext) => {
    context.assert.throws(() => Path.listDirectories(''), NullReferenceException);
    context.assert.throws(() => Path.listDirectories('   '), NullReferenceException);
});