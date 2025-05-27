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
  const request = new Request();
  const headers = new HeaderCollection();
  headers.set('X-Test', 'value');
  const body = new Readable({ read() { } });

  const protocol = 'HTTPS';
  const host = 'example.com';
  const port = 8080;
  const method = 'GET';
  const path = '/path';

  const ret = request.initialize(protocol, host, port, method, path, headers, body);

  context.assert.strictEqual(ret, request);
  context.assert.strictEqual(request.protocol, protocol);
  context.assert.strictEqual(request.host, host);
  context.assert.strictEqual(request.port, port);
  context.assert.strictEqual(request.method, method);
  context.assert.strictEqual(request.path, path);
  context.assert.strictEqual(request.headers, headers);
  context.assert.strictEqual(request.body, body);
  context.assert.strictEqual((request as any).parsedQuery, undefined);
});

test('Request: reset clears fields and returns this', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();
  const body = new Readable({ read() { } });

  request.initialize('HTTPS', 'host', 443, 'POST', '/other', headers, body);

  const ret = request.reset();
  context.assert.strictEqual(ret, request);

  context.assert.strictEqual(request.protocol, undefined);
  context.assert.strictEqual(request.host, undefined);
  context.assert.strictEqual(request.port, undefined);
  context.assert.strictEqual(request.method, undefined);
  context.assert.strictEqual(request.body, undefined);

  context.assert.ok(!request.headers.has('Header'));
  context.assert.strictEqual((request as any).parsedQuery, undefined);
});

test('Request: reset does not replace the headers instance', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();

  request.initialize('HTTPS', 'host', 80, 'PUT', '/x', headers, new Readable({ read() {/* no-op */ } }));
  const sameHeaders = request.headers;
  request.reset();

  context.assert.strictEqual(request.headers, sameHeaders);
  context.assert.strictEqual(Array.from(request.headers.entries()).length, 0);
});