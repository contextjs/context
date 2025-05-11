/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Readable } from 'stream';
import { HeaderCollection } from '../../src/models/header.collection.js';
import { Request } from '../../src/models/request.js';

test('Request: initialize sets all fields and returns this', (context: TestContext) => {
    const req = new Request();
    const headers = new HeaderCollection();
    headers.set('X-Test', 'value');
    const body = new Readable({ read() {/* no-op */ } });

    const ret = req.initialize('GET', '/path', headers, body);
    context.assert.strictEqual(ret, req);
    context.assert.strictEqual(req.method, 'GET');
    context.assert.strictEqual(req.path, '/path');
    context.assert.strictEqual(req.headers, headers);
    context.assert.strictEqual(req.body, body);
});

test('Request: reset clears fields and returns this', (context: TestContext) => {
    const req = new Request();
    const headers = new HeaderCollection();
    headers.set('Header', 'v');
    const body = new Readable({ read() {/* no-op */ } });

    req.initialize('POST', '/other', headers, body);
    const ret = req.reset();
    context.assert.strictEqual(ret, req);
    context.assert.strictEqual(req.method, undefined);
    context.assert.strictEqual(req.path, undefined);
    context.assert.strictEqual(req.body, undefined);
    context.assert.ok(!req.headers.has('Header'));
});

test('Request: reset does not replace the headers instance', (context: TestContext) => {
    const req = new Request();
    const headers = new HeaderCollection();
    req.initialize('PUT', '/x', headers, new Readable({ read() { } }));
    const sameHeaders = req.headers;
    req.reset();
    context.assert.strictEqual(req.headers, sameHeaders);
    context.assert.strictEqual(Array.from(req.headers.entries()).length, 0);
});