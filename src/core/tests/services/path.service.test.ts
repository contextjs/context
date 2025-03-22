/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileExistsException } from "../../src/exceptions/file-exists.exception.js";
import { FileNotFoundException } from "../../src/exceptions/file-not-found.exception.js";
import { NullReferenceException } from "../../src/exceptions/null-reference.exception.js";
import { PathNotFoundException } from '../../src/exceptions/path-not-found.exception.js';
import { StringExtensions } from '../../src/extensions/string.extensions.js';
import { PathService } from "../../src/services/path.service.js";

test('PathService: fileRead - success', (context: TestContext) => {
    const content = 'test content';
    const filePath = 'test.txt';
    PathService.fileSave(filePath, content, true);
    const result = PathService.fileRead(filePath);

    context.assert.strictEqual(result, content);

    PathService.fileDelete(filePath);
});

test('PathService: fileRead - throws FileNotFoundException', (context: TestContext) => {
    const filePath = 'test.txt';

    context.assert.throws(() => PathService.fileRead(filePath), new FileNotFoundException(filePath));
});

test('PathService: fileSave - success', (context: TestContext) => {
    const content = 'test content';
    const filePath = 'test.txt';

    const result = PathService.fileSave(filePath, content, true);

    context.assert.strictEqual(result, true);

    PathService.fileDelete(filePath);
});

test('PathService: fileSave - throws FileExistsException', (context: TestContext) => {
    const content = 'test content';
    const filePath = 'test.txt';
    PathService.fileSave(filePath, content, true);

    context.assert.throws(() => PathService.fileSave(filePath, content), new FileExistsException(filePath));

    PathService.fileDelete(filePath);
});

test('PathService: fileSave - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => PathService.fileSave(StringExtensions.empty, 'content'), new NullReferenceException());
});

test('PathService: fileDelete - success', (context: TestContext) => {
    const content = 'test content';
    const filePath = 'test.txt';
    PathService.fileSave(filePath, content, true);

    const result = PathService.fileDelete(filePath);

    context.assert.strictEqual(result, true);
});

test('PathService: fileDelete - failure', (context: TestContext) => {
    const result = PathService.fileDelete('does-not-exist.txt');
    context.assert.strictEqual(result, false);
});

test('PathService: fileDelete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => PathService.directoryDelete(StringExtensions.empty), new NullReferenceException());
});

test('PathService: directoryDelete - success', (context: TestContext) => {
    const directoryPath = 'test';
    PathService.directoryDelete(directoryPath);
    const result = PathService.exists(directoryPath);

    context.assert.strictEqual(result, false);
});

test('PathService: directoryDelete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => PathService.directoryDelete(StringExtensions.empty), new NullReferenceException());
});

test('PathService: exists - success', (context: TestContext) => {
    const path = 'test.txt';
    PathService.fileSave(path, 'test content', true);

    const result = PathService.exists(path);
    context.assert.strictEqual(result, true);

    PathService.fileDelete(path);
});

test('PathService: exists - failure', (context: TestContext) => {
    const result = PathService.exists('does-not-exist.txt');
    context.assert.strictEqual(result, false);
});

test('PathService: isFile - success', (context: TestContext) => {
    const path = 'test.txt';
    PathService.fileSave(path, 'test content', true);

    const result = PathService.isFile(path);
    context.assert.strictEqual(result, true);

    PathService.fileDelete(path);
});

test('PathService: isFile - failure', (context: TestContext) => {
    context.assert.strictEqual(PathService.isFile(StringExtensions.empty), false);
});

test('PathService: isDirectory - success', (context: TestContext) => {
    const path = 'test';
    PathService.directoryCreate(path);
    const result = PathService.isDirectory(path);

    context.assert.strictEqual(result, true);

    PathService.directoryDelete(path);
});

test('PathService: isDirectory - failure', (context: TestContext) => {
    context.assert.strictEqual(PathService.isDirectory(StringExtensions.empty), false);
});

test('PathService: directoryCreate - success', (context: TestContext) => {
    const path = 'test';
    const result = PathService.directoryCreate(path);

    context.assert.strictEqual(result, true);

    PathService.directoryDelete(path);
});

test('PathService: directoryCreate - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => PathService.directoryCreate(StringExtensions.empty), new NullReferenceException());
});

test('PathService: directoryIsEmpty - success', (context: TestContext) => {
    const path = 'test';
    PathService.directoryCreate(path);

    const result = PathService.directoryIsEmpty(path);
    context.assert.strictEqual(result, true);

    PathService.directoryDelete(path);
});

test('PathService: directoryIsEmpty - failure', (context: TestContext) => {
    const path = 'test';
    PathService.directoryCreate(path);
    PathService.fileSave(`${path}/test.txt`, 'test content', true);

    const result = PathService.directoryIsEmpty(path);
    context.assert.strictEqual(result, false);

    PathService.directoryDelete(path);
});

test('PathService: directoryIsEmpty - throws PathNotFoundException', (context: TestContext) => {
    const nonExistentPath = 'does-not-exist';
    context.assert.throws(() => PathService.directoryIsEmpty(nonExistentPath), new PathNotFoundException(nonExistentPath));
});