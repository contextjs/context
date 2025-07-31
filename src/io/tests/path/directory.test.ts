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
import { UnsupportedPathOperationException } from "../../src/exceptions/unsupported-path-operation.exception.js";
import { DirectoryPathOperation } from "../../src/models/directory-path-operation.js";
import { PathOperationType } from "../../src/models/path-operation-type.js";
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

test('Directory: createAsync - creates directory', async (context: TestContext) => {
    const dir = path.join(base, 'create-async');

    context.assert.strictEqual(await Directory.createAsync(dir), true);
    context.assert.strictEqual(fs.existsSync(dir), true);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: createAsync - no-op if exists', async (context: TestContext) => {
    const dir = path.join(base, 'create-async-noop');
    fs.mkdirSync(dir);

    context.assert.strictEqual(await Directory.createAsync(dir), false);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: renameAsync - renames directory', async (context: TestContext) => {
    const oldDir = path.join(base, 'rename-async-old');
    const newDir = path.join(base, 'rename-async-new');
    fs.mkdirSync(oldDir);

    context.assert.strictEqual(await Directory.renameAsync(oldDir, newDir), true);
    context.assert.strictEqual(fs.existsSync(newDir), true);

    fs.rmSync(newDir, { recursive: true, force: true });
});

test('Directory: renameAsync - throws if old missing', async (context: TestContext) => {
    const oldDir = path.join(base, 'missing-rename-old');
    const newDir = path.join(base, 'rename-never');

    await context.assert.rejects(() => Directory.renameAsync(oldDir, newDir));
});

test('Directory: renameAsync - throws if new exists', async (context: TestContext) => {
    const oldDir = path.join(base, 'rename-already-old');
    const newDir = path.join(base, 'rename-already-new');
    fs.mkdirSync(oldDir);
    fs.mkdirSync(newDir);

    await context.assert.rejects(() => Directory.renameAsync(oldDir, newDir));

    fs.rmSync(oldDir, { recursive: true, force: true });
    fs.rmSync(newDir, { recursive: true, force: true });
});

test('Directory: deleteAsync - deletes directory', async (context: TestContext) => {
    const dir = path.join(base, 'delete-async');
    fs.mkdirSync(dir);

    context.assert.strictEqual(await Directory.deleteAsync(dir), true);
    context.assert.strictEqual(fs.existsSync(dir), false);
});

test('Directory: deleteAsync - returns true if already gone', async (context: TestContext) => {
    const dir = path.join(base, 'delete-async-nonexistent');

    context.assert.strictEqual(await Directory.deleteAsync(dir), true);
});

test('Directory: existsAsync - detects dir', async (context: TestContext) => {
    const dir = path.join(base, 'exists-async');
    fs.mkdirSync(dir);

    context.assert.strictEqual(await Directory.existsAsync(dir), true);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: existsAsync - false if not dir', async (context: TestContext) => {
    const file = path.join(base, 'exists-async-notdir.txt');
    fs.writeFileSync(file, 'x');

    context.assert.strictEqual(await Directory.existsAsync(file), false);

    fs.unlinkSync(file);
});

test('Directory: isEmptyAsync - true when empty', async (context: TestContext) => {
    const dir = path.join(base, 'is-empty-async');
    fs.mkdirSync(dir);

    context.assert.strictEqual(await Directory.isEmptyAsync(dir), true);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: isEmptyAsync - false when not empty', async (context: TestContext) => {
    const dir = path.join(base, 'is-empty-async-no');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'file.txt'), 'x');

    context.assert.strictEqual(await Directory.isEmptyAsync(dir), false);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: isEmptyAsync - throws if missing', async (context: TestContext) => {
    const dir = path.join(base, 'is-empty-async-missing');

    await context.assert.rejects(() => Directory.isEmptyAsync(dir));
});

test('Directory: listFilesAsync - lists all files (non-recursive)', async (context: TestContext) => {
    const dir = path.join(base, 'list-files-async');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'x');
    fs.writeFileSync(path.join(dir, 'b.txt'), 'y');
    fs.mkdirSync(path.join(dir, 'subdir'));

    const files = await Directory.listFilesAsync(dir, false);

    context.assert.deepEqual(files.map(f => path.basename(f)).sort(), ['a.txt', 'b.txt']);

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: listFilesAsync - lists all files (recursive)', async (context: TestContext) => {
    const dir = path.join(base, 'list-files-async-rec');
    const subdir = path.join(dir, 'subdir');
    fs.mkdirSync(dir);
    fs.mkdirSync(subdir);
    fs.writeFileSync(path.join(dir, 'root.txt'), 'x');
    fs.writeFileSync(path.join(subdir, 'child.txt'), 'y');

    const files = await Directory.listFilesAsync(dir, true);

    context.assert.deepEqual(
        files.map(f => path.relative(dir, f)).sort(),
        ['root.txt', path.join('subdir', 'child.txt')]
    );

    fs.rmSync(dir, { recursive: true, force: true });
});

test('Directory: listFilesAsync - throws if not directory', async (context: TestContext) => {
    const file = path.join(base, 'not-a-dir-async.txt');
    fs.writeFileSync(file, 'hi');

    await context.assert.rejects(() => Directory.listFilesAsync(file));

    fs.unlinkSync(file);
});

test('Directory: copy - copies directory recursively', (context: TestContext) => {
    const src = path.join(base, 'copy-src');
    const dest = path.join(base, 'copy-dest');
    Directory.create(src);
    fs.writeFileSync(path.join(src, 'file1.txt'), 'a');
    fs.mkdirSync(path.join(src, 'subdir'));
    fs.writeFileSync(path.join(src, 'subdir', 'file2.txt'), 'b');

    context.assert.strictEqual(Directory.copy(src, dest), true);

    context.assert.strictEqual(fs.existsSync(dest), true);
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'file1.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'file1.txt'), 'utf8'), 'a');
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'subdir', 'file2.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'subdir', 'file2.txt'), 'utf8'), 'b');
});

test('Directory: copy - throws if source does not exist', (context: TestContext) => {
    const src = path.join(base, 'copy-no-src');
    const dest = path.join(base, 'copy-dest-no-src');

    context.assert.throws(() => Directory.copy(src, dest));
});

test('Directory: copyAsync - copies directory recursively', async (context: TestContext) => {
    const src = path.join(base, 'copy-async-src');
    const dest = path.join(base, 'copy-async-dest');
    Directory.create(src);
    fs.writeFileSync(path.join(src, 'fileA.txt'), 'asyncA');
    fs.mkdirSync(path.join(src, 'nest'));
    fs.writeFileSync(path.join(src, 'nest', 'fileB.txt'), 'asyncB');

    context.assert.strictEqual(await Directory.copyAsync(src, dest), true);
    context.assert.strictEqual(fs.existsSync(dest), true);
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'fileA.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'fileA.txt'), 'utf8'), 'asyncA');
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'nest', 'fileB.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'nest', 'fileB.txt'), 'utf8'), 'asyncB');
});

test('Directory: copyAsync - throws if source does not exist', async (context: TestContext) => {
    const src = path.join(base, 'copy-async-missing-src');
    const dest = path.join(base, 'copy-async-missing-dest');

    await context.assert.rejects(() => Directory.copyAsync(src, dest));
});

test('Directory: processOperation - performs copy operation', (context: TestContext) => {
    const src = path.join(base, 'proc-op-src');
    const dest = path.join(base, 'proc-op-dest');
    Directory.create(src);
    fs.writeFileSync(path.join(src, 'a.txt'), 'proc');
    const op = new DirectoryPathOperation(src, dest, PathOperationType.Copy);

    context.assert.strictEqual(Directory.processOperation(op), true);
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'a.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'proc');
});

test('Directory: processOperation - performs move operation', (context: TestContext) => {
    const src = path.join(base, 'proc-op-move-src');
    const dest = path.join(base, 'proc-op-move-dest');
    Directory.create(src);
    const op = new DirectoryPathOperation(src, dest, PathOperationType.Move);

    context.assert.strictEqual(Directory.processOperation(op), true);
    context.assert.strictEqual(fs.existsSync(dest), true);
    context.assert.strictEqual(fs.existsSync(src), false);
});

test('Directory: processOperation - throws on unsupported operation', (context: TestContext) => {
    const op = new DirectoryPathOperation('src', 'dest', "link" as PathOperationType);

    context.assert.throws(() => Directory.processOperation(op), UnsupportedPathOperationException);
});

test('Directory: processOperationAsync - performs copy operation', async (context: TestContext) => {
    const src = path.join(base, 'proc-op-async-src');
    const dest = path.join(base, 'proc-op-async-dest');
    Directory.create(src);
    fs.writeFileSync(path.join(src, 'a.txt'), 'proc-async');
    const op = new DirectoryPathOperation(src, dest, PathOperationType.Copy);

    context.assert.strictEqual(await Directory.processOperationAsync(op), true);
    context.assert.strictEqual(fs.existsSync(path.join(dest, 'a.txt')), true);
    context.assert.strictEqual(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'proc-async');
});

test('Directory: processOperationAsync - throws on unsupported operation', async (context: TestContext) => {
    const op = new DirectoryPathOperation('src', 'dest', "symlink" as PathOperationType);
    await context.assert.rejects(() => Directory.processOperationAsync(op), UnsupportedPathOperationException);
});

test('Directory: processOperations - processes multiple operations', (context: TestContext) => {
    const src1 = path.join(base, 'proc-batch-src1');
    const dest1 = path.join(base, 'proc-batch-dest1');
    const src2 = path.join(base, 'proc-batch-src2');
    const dest2 = path.join(base, 'proc-batch-dest2');
    Directory.create(src1);
    Directory.create(src2);

    const op1 = new DirectoryPathOperation(src1, dest1, PathOperationType.Move);
    const op2 = new DirectoryPathOperation(src2, dest2, PathOperationType.Move);

    Directory.processOperations([op1, op2]);

    context.assert.strictEqual(fs.existsSync(dest1), true);
    context.assert.strictEqual(fs.existsSync(dest2), true);
    context.assert.strictEqual(fs.existsSync(src1), false);
    context.assert.strictEqual(fs.existsSync(src2), false);
});

test('Directory: processOperations - throws NullReferenceException if not array', (context: TestContext) => {
    context.assert.throws(() => Directory.processOperations(undefined as any));
    context.assert.throws(() => Directory.processOperations(null as any));
    context.assert.throws(() => Directory.processOperations("not-an-array" as any));
});

test('Directory: processOperations - does nothing with empty array', (context: TestContext) => {
    context.assert.doesNotThrow(() => Directory.processOperations([]));
});

test('Directory: processOperationsAsync - processes multiple operations', async (context: TestContext) => {
    const src1 = path.join(base, 'proc-batch-async-src1');
    const dest1 = path.join(base, 'proc-batch-async-dest1');
    const src2 = path.join(base, 'proc-batch-async-src2');
    const dest2 = path.join(base, 'proc-batch-async-dest2');
    Directory.create(src1);
    Directory.create(src2);

    const op1 = new DirectoryPathOperation(src1, dest1, PathOperationType.Move);
    const op2 = new DirectoryPathOperation(src2, dest2, PathOperationType.Move);

    await Directory.processOperationsAsync([op1, op2]);

    context.assert.strictEqual(fs.existsSync(dest1), true);
    context.assert.strictEqual(fs.existsSync(dest2), true);
    context.assert.strictEqual(fs.existsSync(src1), false);
    context.assert.strictEqual(fs.existsSync(src2), false);
});

test('Directory: processOperationsAsync - throws NullReferenceException if not array', async (context: TestContext) => {
    await context.assert.rejects(() => Directory.processOperationsAsync(undefined as any));
    await context.assert.rejects(() => Directory.processOperationsAsync(null as any));
    await context.assert.rejects(() => Directory.processOperationsAsync("not-an-array" as any));
});

test('Directory: processOperationsAsync - does nothing with empty array', async (context: TestContext) => {
    await context.assert.doesNotReject(() => Directory.processOperationsAsync([]));
});