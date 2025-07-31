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
import { FilePathOperation } from "../../src/models/file-path-operation.js";
import { PathOperationType } from "../../src/models/path-operation-type.js";
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

test('File: copy - success', (context: TestContext) => {
    const source = path.join(base, 'copy-source.txt');
    const target = path.join(base, 'copy-target.txt');

    File.save(source, 'copy content', true);
    const result = File.copy(source, target);

    context.assert.strictEqual(result, true);
    context.assert.strictEqual(File.read(target), 'copy content');
});

test('File: copy - throws FileNotFoundException', (context: TestContext) => {
    const source = path.join(base, 'missing-copy.txt');
    const target = path.join(base, 'copy-target2.txt');

    context.assert.throws(() => File.copy(source, target));
});

test('File: copy - throws FileExistsException', (context: TestContext) => {
    const source = path.join(base, 'copy-source2.txt');
    const target = path.join(base, 'copy-existing.txt');

    File.save(source, 'a');
    File.save(target, 'b');

    context.assert.throws(() => File.copy(source, target));
});

test('File: getName - returns basename when file exists', (context: TestContext) => {
    const file = path.join(base, 'dir1/dir2/file.TXT');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'x');

    context.assert.strictEqual(File.getName(file), 'file.TXT');
});

test('File: getName - throws on null or whitespace', (context: TestContext) => {
    context.assert.throws(() => File.getName(StringExtensions.empty));
    context.assert.throws(() => File.getName('   '));
});

test('File: getDirectory - returns dirname when file exists', (context: TestContext) => {
    const file = path.join(base, 'a/b/c.txt');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'y');

    context.assert.strictEqual(File.getDirectory(file), path.normalize(path.dirname(file)));
});

test('File: getDirectory - throws on null or whitespace', (context: TestContext) => {
    context.assert.throws(() => File.getDirectory(StringExtensions.empty));
    context.assert.throws(() => File.getDirectory('	'));
});

test('File: getExtension - returns extension (lowercased) when file exists', (context: TestContext) => {
    const file = path.join(base, 'sample.Ext1');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'z');

    context.assert.strictEqual(File.getExtension(file), 'ext1');
});

test('File: getExtension - returns empty string when file has no extension', (context: TestContext) => {
    const file = path.join(base, 'README');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'r');

    context.assert.strictEqual(File.getExtension(file), '');
});

test('File: getExtension - throws on null or whitespace', (context: TestContext) => {
    context.assert.throws(() => File.getExtension(StringExtensions.empty));
    context.assert.throws(() => File.getExtension(' '));
});

test('File: readAsync - success', async (context: TestContext) => {
    const file = path.join(base, 'read-async.txt');
    fs.writeFileSync(file, 'async hello');

    context.assert.strictEqual(await File.readAsync(file), 'async hello');

    fs.unlinkSync(file);
});

test('File: readAsync - throws if not found', async (context: TestContext) => {
    const file = path.join(base, 'missing-read.txt');

    await context.assert.rejects(() => File.readAsync(file));
});

test('File: saveAsync - creates file', async (context: TestContext) => {
    const file = path.join(base, 'save-async.txt');

    context.assert.strictEqual(await File.saveAsync(file, 'new content'), true);
    context.assert.strictEqual(fs.readFileSync(file, 'utf8'), 'new content');

    fs.unlinkSync(file);
});

test('File: saveAsync - throws if exists and no overwrite', async (context: TestContext) => {
    const file = path.join(base, 'save-async-exists.txt');
    fs.writeFileSync(file, 'exists');

    await context.assert.rejects(() => File.saveAsync(file, 'overwrite = false'));

    fs.unlinkSync(file);
});

test('File: saveAsync - overwrites if allowed', async (context: TestContext) => {
    const file = path.join(base, 'save-async-overwrite.txt');
    fs.writeFileSync(file, 'old');

    context.assert.strictEqual(await File.saveAsync(file, 'new', true), true);
    context.assert.strictEqual(fs.readFileSync(file, 'utf8'), 'new');

    fs.unlinkSync(file);
});

test('File: renameAsync - renames file', async (context: TestContext) => {
    const oldFile = path.join(base, 'rename-async-old.txt');
    const newFile = path.join(base, 'rename-async-new.txt');
    fs.writeFileSync(oldFile, 'abc');

    context.assert.strictEqual(await File.renameAsync(oldFile, newFile), true);
    context.assert.strictEqual(fs.existsSync(newFile), true);

    fs.unlinkSync(newFile);
});

test('File: renameAsync - throws if old missing', async (context: TestContext) => {
    const oldFile = path.join(base, 'missing-rename-old.txt');
    const newFile = path.join(base, 'rename-never.txt');

    await context.assert.rejects(() => File.renameAsync(oldFile, newFile));
});

test('File: renameAsync - throws if new exists', async (context: TestContext) => {
    const oldFile = path.join(base, 'rename-already-old.txt');
    const newFile = path.join(base, 'rename-already-new.txt');
    fs.writeFileSync(oldFile, 'abc');
    fs.writeFileSync(newFile, 'xyz');

    await context.assert.rejects(() => File.renameAsync(oldFile, newFile));

    fs.unlinkSync(oldFile);
    fs.unlinkSync(newFile);
});

test('File: deleteAsync - deletes file', async (context: TestContext) => {
    const file = path.join(base, 'delete-async.txt');
    fs.writeFileSync(file, 'x');

    context.assert.strictEqual(await File.deleteAsync(file), true);
    context.assert.strictEqual(fs.existsSync(file), false);
});

test('File: deleteAsync - false if already gone', async (context: TestContext) => {
    const file = path.join(base, 'delete-async-missing.txt');

    context.assert.strictEqual(await File.deleteAsync(file), false);
});

test('File: copyAsync - copies file', async (context: TestContext) => {
    const source = path.join(base, 'copy-async-source.txt');
    const target = path.join(base, 'copy-async-target.txt');
    fs.writeFileSync(source, 'copy content');

    context.assert.strictEqual(await File.copyAsync(source, target), true);
    context.assert.strictEqual(fs.readFileSync(target, 'utf8'), 'copy content');

    fs.unlinkSync(source);
    fs.unlinkSync(target);
});

test('File: copyAsync - throws if source missing', async (context: TestContext) => {
    const source = path.join(base, 'copy-async-missing.txt');
    const target = path.join(base, 'copy-async-target2.txt');

    await context.assert.rejects(() => File.copyAsync(source, target));
});

test('File: copyAsync - throws if target exists and not overwrite', async (context: TestContext) => {
    const source = path.join(base, 'copy-async-src2.txt');
    const target = path.join(base, 'copy-async-target3.txt');
    fs.writeFileSync(source, '1');
    fs.writeFileSync(target, '2');

    await context.assert.rejects(() => File.copyAsync(source, target));

    fs.unlinkSync(source);
    fs.unlinkSync(target);
});

test('File: copyAsync - overwrites if allowed', async (context: TestContext) => {
    const source = path.join(base, 'copy-async-src3.txt');
    const target = path.join(base, 'copy-async-target4.txt');
    fs.writeFileSync(source, 'overwrite');
    fs.writeFileSync(target, 'old');

    context.assert.strictEqual(await File.copyAsync(source, target, true), true);
    context.assert.strictEqual(fs.readFileSync(target, 'utf8'), 'overwrite');

    fs.unlinkSync(source);
    fs.unlinkSync(target);
});

test('File: existsAsync - true for file', async (context: TestContext) => {
    const file = path.join(base, 'exists-async.txt');
    fs.writeFileSync(file, 'x');

    context.assert.strictEqual(await File.existsAsync(file), true);

    fs.unlinkSync(file);
});

test('File: existsAsync - false if missing', async (context: TestContext) => {
    const file = path.join(base, 'exists-async-missing.txt');

    context.assert.strictEqual(await File.existsAsync(file), false);
});

test('File: processOperation - performs copy', (context: TestContext) => {
    const src = path.join(base, 'proc-op-file-src.txt');
    const dest = path.join(base, 'proc-op-file-dest.txt');
    File.save(src, 'abc', true);

    const op = new FilePathOperation(src, dest, PathOperationType.Copy);
    context.assert.strictEqual(File.processOperation(op), true);
    context.assert.strictEqual(File.read(dest), 'abc');
});

test('File: processOperation - performs move', (context: TestContext) => {
    const src = path.join(base, 'proc-op-file-move-src.txt');
    const dest = path.join(base, 'proc-op-file-move-dest.txt');
    File.save(src, 'move!');
    const op = new FilePathOperation(src, dest, PathOperationType.Move);

    context.assert.strictEqual(File.processOperation(op), true);
    context.assert.strictEqual(File.exists(dest), true);
    context.assert.strictEqual(File.exists(src), false);
    context.assert.strictEqual(File.read(dest), 'move!');
});

test('File: processOperation - throws on unsupported operation', (context: TestContext) => {
    const op = new FilePathOperation('src.txt', 'dest.txt', "symlink" as PathOperationType);
    
    context.assert.throws(() => File.processOperation(op), UnsupportedPathOperationException);
});

test('File: processOperationAsync - performs copy', async (context: TestContext) => {
    const src = path.join(base, 'proc-op-async-file-src.txt');
    const dest = path.join(base, 'proc-op-async-file-dest.txt');
    await File.saveAsync(src, 'async-copy');
    const op = new FilePathOperation(src, dest, PathOperationType.Copy);

    context.assert.strictEqual(await File.processOperationAsync(op), true);
    context.assert.strictEqual(await File.readAsync(dest), 'async-copy');
});

test('File: processOperationAsync - performs move', async (context: TestContext) => {
    const src = path.join(base, 'proc-op-async-file-move-src.txt');
    const dest = path.join(base, 'proc-op-async-file-move-dest.txt');
    await File.saveAsync(src, 'async-move');
    const op = new FilePathOperation(src, dest, PathOperationType.Move);

    context.assert.strictEqual(await File.processOperationAsync(op), true);
    context.assert.strictEqual(await File.existsAsync(dest), true);
    context.assert.strictEqual(await File.existsAsync(src), false);
    context.assert.strictEqual(await File.readAsync(dest), 'async-move');
});

test('File: processOperationAsync - throws on unsupported operation', async (context: TestContext) => {
    const op = new FilePathOperation('src.txt', 'dest.txt', "symlink" as PathOperationType);
    
    await context.assert.rejects(() => File.processOperationAsync(op), UnsupportedPathOperationException);
});

test('File: processOperations - processes multiple operations', (context: TestContext) => {
    const src1 = path.join(base, 'batch-file-src1.txt');
    const dest1 = path.join(base, 'batch-file-dest1.txt');
    const src2 = path.join(base, 'batch-file-src2.txt');
    const dest2 = path.join(base, 'batch-file-dest2.txt');
    File.save(src1, 'batch1');
    File.save(src2, 'batch2');

    const op1 = new FilePathOperation(src1, dest1, PathOperationType.Move);
    const op2 = new FilePathOperation(src2, dest2, PathOperationType.Move);

    File.processOperations([op1, op2]);

    context.assert.strictEqual(File.exists(dest1), true);
    context.assert.strictEqual(File.exists(dest2), true);
    context.assert.strictEqual(File.exists(src1), false);
    context.assert.strictEqual(File.exists(src2), false);
    context.assert.strictEqual(File.read(dest1), 'batch1');
    context.assert.strictEqual(File.read(dest2), 'batch2');
});

test('File: processOperations - throws NullReferenceException if not array', (context: TestContext) => {
    context.assert.throws(() => File.processOperations(undefined as any));
    context.assert.throws(() => File.processOperations(null as any));
    context.assert.throws(() => File.processOperations("not-an-array" as any));
});

test('File: processOperations - does nothing with empty array', (context: TestContext) => {
    context.assert.doesNotThrow(() => File.processOperations([]));
});

test('File: processOperationsAsync - processes multiple operations', async (context: TestContext) => {
    const src1 = path.join(base, 'batch-async-file-src1.txt');
    const dest1 = path.join(base, 'batch-async-file-dest1.txt');
    const src2 = path.join(base, 'batch-async-file-src2.txt');
    const dest2 = path.join(base, 'batch-async-file-dest2.txt');
    await File.saveAsync(src1, 'async-batch1');
    await File.saveAsync(src2, 'async-batch2');

    const op1 = new FilePathOperation(src1, dest1, PathOperationType.Move);
    const op2 = new FilePathOperation(src2, dest2, PathOperationType.Move);

    await File.processOperationsAsync([op1, op2]);

    context.assert.strictEqual(await File.existsAsync(dest1), true);
    context.assert.strictEqual(await File.existsAsync(dest2), true);
    context.assert.strictEqual(await File.existsAsync(src1), false);
    context.assert.strictEqual(await File.existsAsync(src2), false);
    context.assert.strictEqual(await File.readAsync(dest1), 'async-batch1');
    context.assert.strictEqual(await File.readAsync(dest2), 'async-batch2');
});

test('File: processOperationsAsync - throws NullReferenceException if not array', async (context: TestContext) => {
    await context.assert.rejects(() => File.processOperationsAsync(undefined as any));
    await context.assert.rejects(() => File.processOperationsAsync(null as any));
    await context.assert.rejects(() => File.processOperationsAsync("not-an-array" as any));
});

test('File: processOperationsAsync - does nothing with empty array', async (context: TestContext) => {
    await context.assert.doesNotReject(() => File.processOperationsAsync([]));
});