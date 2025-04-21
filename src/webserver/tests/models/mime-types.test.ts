/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { MimeTypes } from '../../src/models/mime-types.js';

test('MimeTypes: returns correct type for known extension', async (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('html'), 'text/html');
    context.assert.strictEqual(MimeTypes.get('png'), 'image/png');
    context.assert.strictEqual(MimeTypes.get('zip'), 'application/zip');
});

test('MimeTypes: returns null for unknown extension', async (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('unknownext'), null);
});