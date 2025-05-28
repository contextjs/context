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

  const initializedRequest = request.initialize(protocol, host, port, method, path, headers, body);

  context.assert.strictEqual(initializedRequest, request);
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
  const resetRequest = request.reset();

  context.assert.strictEqual(resetRequest, request);
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

  request.initialize('HTTPS', 'host', 80, 'PUT', '/x', headers, new Readable({ read() { } }));
  const sameHeaders = request.headers;
  request.reset();

  context.assert.strictEqual(request.headers, sameHeaders);
  context.assert.strictEqual(Array.from(request.headers.entries()).length, 0);
});

test('Request: path and rawQuery getters without overrides', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();

  request.initialize('HTTP', 'host', 80, 'GET', '/foo/bar?one=1&two=2', headers, new Readable({ read() { } }));

  context.assert.strictEqual(request.path, '/foo/bar');
  context.assert.strictEqual(request.rawQuery, 'one=1&two=2');
});

test('Request: path and rawQuery getters with overrides', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();
  request.initialize('HTTP', 'host', 80, 'GET', '/unused', headers, new Readable({ read() { } }));

  (request as any)._path = '/override';
  (request as any)._rawQuery = 'a=b';

  context.assert.strictEqual(request.path, '/override');
  context.assert.strictEqual(request.rawQuery, 'a=b');
});

test('Request: queryParams parses rawQuery into dictionary including arrays', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();

  request.initialize('HTTP', 'host', 80, 'GET', '/p?key=one&key=two&other=3', headers, new Readable({ read() { } }));

  const qp1 = request.queryParams;
  const keyVal = qp1.get('key');

  context.assert.strictEqual(qp1.has('key'), true);
  context.assert.strictEqual(qp1.has('other'), true);
  context.assert.ok(Array.isArray(keyVal));
  context.assert.strictEqual((keyVal as string[]).length, 2);
  context.assert.strictEqual((keyVal as string[])[0], 'one');
  context.assert.strictEqual((keyVal as string[])[1], 'two');
  context.assert.strictEqual(qp1.get('other'), '3');
});

test('Request: queryParams returns empty dictionary for no rawQuery', (context: TestContext) => {
  const request = new Request();
  const headers = new HeaderCollection();
  request.initialize('HTTP', 'host', 80, 'GET', '/justpath', headers, new Readable({ read() { } }));

  const qp = request.queryParams;
  context.assert.strictEqual(qp.keys().length, 0);
});