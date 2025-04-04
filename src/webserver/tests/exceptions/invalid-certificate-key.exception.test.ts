/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { InvalidCertificateKeyException } from '../../src/exceptions/invalid-certificate-key.exception.js';

test('InvalidCertificateKeyException - contructor - success', async (context: TestContext) => {
    const name = 'test-key-name';
    const exception = new InvalidCertificateKeyException(name);

    context.assert.strictEqual(exception.name, 'InvalidCertificateKeyException');
    context.assert.strictEqual(exception.message, `Invalid certificate key: ${name}`);
});