/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/core';
import test, { TestContext } from 'node:test';
import { Directory } from '../src/path/directory.ts';

test('Directory: create - success', (context: TestContext) => {
    const directory = '/directory';
    context.assert.strictEqual(Directory.create(directory), true);

    Directory.delete(directory);
});

test('Directory: create - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.create(StringExtensions.empty));
});

test('Directory: create - path exists', (context: TestContext) => {
    const directory = '/directory';
    Directory.create(directory);

    context.assert.strictEqual(Directory.create(directory), false);

    Directory.delete(directory);
});

test('Directory: rename - success', (context: TestContext) => {
    const oldDirectory = '/old-directory';
    const newDirectory = '/new-directory';
    Directory.create(oldDirectory);
    const result = Directory.rename(oldDirectory, newDirectory);

    context.assert.strictEqual(result, true);

    Directory.delete(newDirectory);
});

test('Directory: rename - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.rename(StringExtensions.empty, '/new-directory'));
    context.assert.throws(() => Directory.rename('/old-directory', StringExtensions.empty));
});

test('Directory: rename - throws PathNotFoundException', (context: TestContext) => {
    context.assert.throws(() => Directory.rename('/old-directory', '/new-directory'));
});

test('Directory: rename - path exists', (context: TestContext) => {
    const oldDirectory = '/old-directory';
    const newDirectory = '/new-directory';
    Directory.create(oldDirectory);
    Directory.create(newDirectory);

    context.assert.throws(() => Directory.rename(oldDirectory, newDirectory));

    Directory.delete(oldDirectory);
    Directory.delete(newDirectory);
});

test('Directory: delete - success', (context: TestContext) => {
    const directory = '/directory';
    Directory.create(directory);
    const result = Directory.delete(directory);

    context.assert.strictEqual(result, true);
});

test('Directory: delete - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.delete(StringExtensions.empty));
});

test('Directory: delete - path does not exist', (context: TestContext) => {
    const directory = '/directory';

    context.assert.strictEqual(Directory.delete(directory), true);
});

test('Directory: exists - success', (context: TestContext) => {
    const directory = '/directory';
    Directory.create(directory);

    context.assert.strictEqual(Directory.exists(directory), true);

    Directory.delete(directory);
});

test('Directory: exists - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Directory.exists(StringExtensions.empty));
});

test('Directory: exists - path does not exist', (context: TestContext) => {
    const directory = '/directory';

    context.assert.strictEqual(Directory.exists(directory), false);
});

test('Directory: isEmpty - success', (context: TestContext) => {
    const directory = '/directory';
    Directory.create(directory);

    context.assert.strictEqual(Directory.isEmpty(directory), true);

    Directory.delete(directory);
});

test('Directory: isEmpty - throws PathNotFoundException', (context: TestContext) => {
    context.assert.throws(() => Directory.isEmpty('/directory'));
});

test('Directory: isEmpty - directory is not empty', (context: TestContext) => {
    const directory = '/directory';
    Directory.create(directory);
    Directory.create(`${directory}/file`);

    context.assert.strictEqual(Directory.isEmpty(directory), false);

    Directory.delete(directory);
});