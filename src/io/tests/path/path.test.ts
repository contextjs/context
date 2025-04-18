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