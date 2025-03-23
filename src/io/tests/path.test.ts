/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Directory, Path } from '../src/api';

test('Path: exists - success', (context: TestContext) => {
    const path = 'path';
    Directory.create(path);

    context.assert.strictEqual(Path.exists(path), true);

    Directory.delete(path);
});

test('Path: exists - failure', (context: TestContext) => {
    const path = 'path';

    context.assert.strictEqual(Path.exists(path), false);
});

test('Path: isDirectory - success', (context: TestContext) => {
    const path = 'path';
    Directory.create(path);

    context.assert.strictEqual(Path.isDirectory(path), true);

    Directory.delete(path);
});

test('Path: isDirectory - failure', (context: TestContext) => {
    const path = 'path';

    context.assert.strictEqual(Path.isDirectory(path), false);
});

test('Path: isFile - success', (context: TestContext) => {
    const path = 'path';
    Directory.create(path);

    context.assert.strictEqual(Path.isFile(path), false);

    Directory.delete(path);
});

test('Path: isFile - failure', (context: TestContext) => {
    const path = 'path';

    context.assert.strictEqual(Path.isFile(path), false);
});