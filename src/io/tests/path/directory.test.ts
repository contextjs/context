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
import { Directory } from '../../src/path/directory.ts';

const base = fs.mkdtempSync(path.join(os.tmpdir(), 'contextjs-directory-'));

after(() => {
    if (fs.existsSync(base))
        fs.rmSync(base, { recursive: true, force: true });
});

test('Directory: create - success', (context: TestContext) => {
    const dir = path.join(base, 'create-success');
    context.assert.strictEqual(Directory.create(dir), true);
});

test('Directory: create - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.create(StringExtensions.empty));
});

test('Directory: create - path exists', (context: TestContext) => {
    const dir = path.join(base, 'create-exists');
    Directory.create(dir);
    context.assert.strictEqual(Directory.create(dir), false);
});

test('Directory: rename - success', (context: TestContext) => {
    const oldDir = path.join(base, 'rename-old');
    const newDir = path.join(base, 'rename-new');
    Directory.create(oldDir);
    const result = Directory.rename(oldDir, newDir);
    context.assert.strictEqual(result, true);
});

test('Directory: rename - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.rename(StringExtensions.empty, 'new-dir'));
    context.assert.throws(() => Directory.rename('old-dir', StringExtensions.empty));
});

test('Directory: rename - throws PathNotFoundException', (context: TestContext) => {
    const oldDir = path.join(base, 'rename-not-found');
    const newDir = path.join(base, 'rename-target');
    context.assert.throws(() => Directory.rename(oldDir, newDir));
});

test('Directory: rename - path exists', (context: TestContext) => {
    const oldDir = path.join(base, 'rename-collision-old');
    const newDir = path.join(base, 'rename-collision-new');
    Directory.create(oldDir);
    Directory.create(newDir);
    context.assert.throws(() => Directory.rename(oldDir, newDir));
});

test('Directory: delete - success', (context: TestContext) => {
    const dir = path.join(base, 'delete-success');
    Directory.create(dir);
    const result = Directory.delete(dir);
    context.assert.strictEqual(result, true);
});

test('Directory: delete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.delete(StringExtensions.empty));
});

test('Directory: delete - path does not exist', (context: TestContext) => {
    const dir = path.join(base, `delete-missing-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    context.assert.strictEqual(Directory.exists(dir), false);
    context.assert.strictEqual(Directory.delete(dir), true);
});

test('Directory: exists - success', (context: TestContext) => {
    const dir = path.join(base, 'exists-true');
    Directory.create(dir);
    context.assert.strictEqual(Directory.exists(dir), true);
});

test('Directory: exists - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.exists(StringExtensions.empty));
});

test('Directory: exists - path does not exist', (context: TestContext) => {
    const dir = path.join(base, 'exists-false');
    context.assert.strictEqual(Directory.exists(dir), false);
});

test('Directory: isEmpty - success', (context: TestContext) => {
    const dir = path.join(base, 'is-empty-true');
    Directory.create(dir);
    context.assert.strictEqual(Directory.isEmpty(dir), true);
});

test('Directory: isEmpty - throws PathNotFoundException', (context: TestContext) => {
    const dir = path.join(base, 'is-empty-missing');
    context.assert.throws(() => Directory.isEmpty(dir));
});

test('Directory: isEmpty - directory is not empty', (context: TestContext) => {
    const dir = path.join(base, 'is-empty-false');
    Directory.create(dir);
    fs.writeFileSync(path.join(dir, 'file.txt'), 'data');
    context.assert.strictEqual(Directory.isEmpty(dir), false);
});

test('Directory: listFiles - success non-recursive', (context: TestContext) => {
    const dir = path.join(base, 'list-non-recursive');
    Directory.create(dir);

    fs.writeFileSync(path.join(dir, 'a.txt'), 'a');
    fs.writeFileSync(path.join(dir, 'b.txt'), 'b');

    const files = Directory.listFiles(dir);
    context.assert.strictEqual(files.length, 2);
    context.assert.ok(files.some(x => x.endsWith('a.txt')));
    context.assert.ok(files.some(x => x.endsWith('b.txt')));
});

test('Directory: listFiles - success recursive', (context: TestContext) => {
    const root = path.join(base, 'list-recursive');
    const sub = path.join(root, 'nested');

    Directory.create(sub);
    fs.writeFileSync(path.join(root, 'a.txt'), 'a');
    fs.writeFileSync(path.join(sub, 'b.txt'), 'b');

    const files = Directory.listFiles(root, true);
    context.assert.strictEqual(files.length, 2);
    context.assert.ok(files.some(x => x.endsWith('a.txt')));
    context.assert.ok(files.some(x => x.endsWith('b.txt')));
});

test('Directory: listFiles - throws PathNotFoundException', (context: TestContext) => {
    const dir = path.join(base, 'list-missing');
    context.assert.throws(() => Directory.listFiles(dir), /PathNotFoundException/);
});