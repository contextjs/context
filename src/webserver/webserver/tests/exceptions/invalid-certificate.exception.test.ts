/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { InvalidCertificateException } from '../../src/exceptions/invalid-certificate.exception.js';

test('InvalidCertificateException: constructor', async (context: TestContext) => {
    const name = 'test-name';
    const exception = new InvalidCertificateException(name);

    context.assert.strictEqual(exception.name, 'InvalidCertificateException');
    context.assert.strictEqual(exception.message, `Invalid certificate: ${name}`);
});