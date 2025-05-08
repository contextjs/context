/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { InvalidCertificateKeyException } from '../../src/exceptions/invalid-certificate-key.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('InvalidCertificateKeyException: instance and inheritance', (context: TestContext) => {
    const exception = new InvalidCertificateKeyException('myKey');

    context.assert.ok(exception instanceof InvalidCertificateKeyException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('InvalidCertificateKeyException: name property', (context: TestContext) => {
    const exception = new InvalidCertificateKeyException('foo');

    context.assert.strictEqual(exception.name, 'InvalidCertificateKeyException');
});

test('InvalidCertificateKeyException: message formatting', (context: TestContext) => {
    const exception = new InvalidCertificateKeyException('serverKey');

    context.assert.strictEqual(exception.message, 'Invalid certificate key: serverKey');
});

test('InvalidCertificateKeyException: toString output', (context: TestContext) => {
    const exception = new InvalidCertificateKeyException('cert');

    context.assert.strictEqual(exception.toString(), 'InvalidCertificateKeyException: Invalid certificate key: cert');
});