/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { StaticFilesOptions } from '../../src/extensions/static-files.options.js';

test('StaticFilesOptions: constructor - success', async (context: TestContext) => {
    const staticFilesOptions = new StaticFilesOptions();
    staticFilesOptions.publicFolder = 'public';
    staticFilesOptions.fileExtensions = ['html', 'css', 'js'];

    context.assert.strictEqual(staticFilesOptions.publicFolder, 'public');
    context.assert.strictEqual(staticFilesOptions.fileExtensions.length, 3);
    context.assert.strictEqual(staticFilesOptions.fileExtensions[0], 'html');
    context.assert.strictEqual(staticFilesOptions.fileExtensions[1], 'css');
    context.assert.strictEqual(staticFilesOptions.fileExtensions[2], 'js');
});

test("StaticFilesOptions: default values", (context: TestContext) => {
    const options = new StaticFilesOptions();

    context.assert.strictEqual(options.publicFolder, "public");
    context.assert.deepStrictEqual(options.fileExtensions, []);
});