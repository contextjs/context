/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { MimeTypes } from '../../src/models/mime-types.js';

test('MimeTypes: returns correct MIME type for known extensions', (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('123'), 'application/vnd.lotus-1-2-3');
    context.assert.strictEqual(MimeTypes.get('3ds'), 'image/x-3ds');
});

test('MimeTypes: returns null for unknown extension when no default provided', (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('unknown'), null);
});

test('MimeTypes: returns provided default for unknown extension', (context: TestContext) => {
    const defaultType = 'application/octet-stream';

    context.assert.strictEqual(MimeTypes.get('no-such-ext', defaultType), defaultType);
});

test('MimeTypes: returns null when defaultType is explicitly null', (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('3gp', null), 'video/3gpp');
    context.assert.strictEqual(MimeTypes.get('123456', null), null);
});

test('MimeTypes: lookup is case-sensitive and uses exact match', (context: TestContext) => {
    context.assert.strictEqual(MimeTypes.get('3GP', 'fallback'), 'fallback');
    context.assert.strictEqual(MimeTypes.get('', 'fallback'), 'fallback');
});