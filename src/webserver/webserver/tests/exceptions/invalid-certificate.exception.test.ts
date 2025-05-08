/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { InvalidCertificateException } from '../../src/exceptions/invalid-certificate.exception.js';
import { WebServerException } from '../../src/exceptions/webserver.exception.js';

test('InvalidCertificateException: instance and inheritance', (context: TestContext) => {
    const exception = new InvalidCertificateException('myCert');

    context.assert.ok(exception instanceof InvalidCertificateException);
    context.assert.ok(exception instanceof WebServerException);
    context.assert.ok(exception instanceof Error);
});

test('InvalidCertificateException: name property', (context: TestContext) => {
    const exception = new InvalidCertificateException('foo');

    context.assert.strictEqual(exception.name, 'InvalidCertificateException');
});

test('InvalidCertificateException: message formatting', (context: TestContext) => {
    const exception = new InvalidCertificateException('serverCert');

    context.assert.strictEqual(exception.message, 'Invalid certificate: serverCert');
});

test('InvalidCertificateException: toString output', (context: TestContext) => {
    const exception = new InvalidCertificateException('certA');

    context.assert.strictEqual(exception.toString(), 'InvalidCertificateException: Invalid certificate: certA');
});