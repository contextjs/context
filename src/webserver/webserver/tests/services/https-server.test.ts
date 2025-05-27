/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EventEmitter } from 'node:events';
import { ServerHttp2Stream } from 'node:http2';
import { dirname, resolve } from 'node:path';
import { PassThrough } from 'node:stream';
import test, { TestContext } from 'node:test';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';
import { Http2Response } from '../../src/models/http2-response.js';
import { WebServerOptions } from '../../src/options/webserver-options.js';
import { HttpsServer } from '../../src/services/https-server.js';
import { HttpContext } from '../../src/models/http-context.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = resolve(__dirname, '../fixtures/test-key.pem');
const CERT_PATH = resolve(__dirname, '../fixtures/test-cert.pem');

test('HttpsServer: startAsync and stopAsync complete without hanging', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = new WebServerOptions(
        { maximumHeaderSize: 1024, httpContextPoolSize: 2, idleSocketsTimeout: 100 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: '127.0.0.1', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        (e: any) => events.push(e)
    );
    const server = new HttpsServer(options);
    await server.startAsync();
    await server.stopAsync();

    context.assert.ok(events.some(e => e.type === 'info' && /listening/.test(e.detail)));
    context.assert.ok(events.some(e => e.type === 'info' && /fully stopped/.test(e.detail)));
});

test('HttpsServer: Default middleware: writes "hello" via Http2Response', (context: TestContext): void => {
    const fakeStream = new PassThrough();
    const fakeHttp2Stream = {
        respond: (_headers: Record<string, any>): void => { },
        end: (data: Buffer | string): void => {
            if (typeof data === 'string')
                fakeStream.end(Buffer.from(data));
            else
                fakeStream.end(data);
        }
    } as unknown as ServerHttp2Stream;

    const response = new Http2Response().initialize(fakeHttp2Stream);

    response
        .setStatus(200, 'OK')
        .setHeader('content-type', 'text/plain')
        .send(Buffer.from('hello'));

    const resultBuffer = fakeStream.read() as Buffer;
    const result = resultBuffer.toString('utf8');

    context.assert.strictEqual(result, 'hello');
});

test('HttpsServer: session event applies settings and cleans up on close', (context: TestContext) => {
    const opts = new WebServerOptions(
        { maximumHeaderSize: 1234, httpContextPoolSize: 2, idleSocketsTimeout: 5 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: '127.0.0.1', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        () => { }
    );

    const server = new HttpsServer(opts);

    const fakeSession = new EventEmitter() as any;
    let appliedSettings: Record<string, unknown> | null = null;
    fakeSession.settings = (settings: Record<string, unknown>) => { appliedSettings = settings; };

    server['sessions'].clear();
    context.assert.strictEqual(server['sessions'].size, 0);

    (server as any).httpsServer.emit('session', fakeSession);

    context.assert.ok(appliedSettings);
    context.assert.strictEqual((appliedSettings as any).maxConcurrentStreams, 1_000);
    context.assert.strictEqual((appliedSettings as any).headerTableSize, 32_768);
    context.assert.strictEqual((appliedSettings as any).maxHeaderListSize, opts.general.maximumHeaderSize);
    context.assert.strictEqual((appliedSettings as any).initialWindowSize, 1 << 20);

    context.assert.ok(server['sessions'].has(fakeSession));

    fakeSession.emit('close');
    context.assert.ok(!server['sessions'].has(fakeSession));
});

test('HttpsServer: session event applies settings and cleans up on close', (context: TestContext) => {
    const options: WebServerOptions = new WebServerOptions(
        { maximumHeaderSize: 2048, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        () => { }
    );
    const server = new HttpsServer(options);

    const fakeSession = new EventEmitter() as any;
    let capturedSettings: Record<string, unknown> | null = null;
    fakeSession.settings = (settings: Record<string, unknown>) => { capturedSettings = settings; };

    server['sessions'].clear();
    context.assert.strictEqual(server['sessions'].size, 0);

    server['httpsServer'].emit('session', fakeSession);

    context.assert.ok(capturedSettings);
    context.assert.strictEqual((capturedSettings as any).maxConcurrentStreams, 1000);
    context.assert.strictEqual((capturedSettings as any).headerTableSize, 32768);
    context.assert.strictEqual((capturedSettings as any).maxHeaderListSize, options.general.maximumHeaderSize);
    context.assert.strictEqual((capturedSettings as any).initialWindowSize, 1 << 20);

    context.assert.ok(server['sessions'].has(fakeSession));
    fakeSession.emit('close');
    context.assert.ok(!server['sessions'].has(fakeSession));
});

test('HttpsServer: stream event dispatches request and releases context', async (t: TestContext) => {
  const events: any[] = [];
  const options = new WebServerOptions(
    { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
    { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
    { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
    (e: any) => events.push(e)
  );
  const server = new HttpsServer(options);

  const acquired: Array<[string, string][]> = [];
  const released: HttpContext[] = [];

  // use a real HttpContext so reset()/initialize() exist
  const dummy = new HttpContext();

  // stub out reset() to be a no-op
  (dummy as any).reset = () => dummy;

  // stub initialize() on the context itself:
  // HttpsServer calls context.initialize(protocol, host, port, method, path, headers, target, body)
  (dummy as any).initialize = (
    _protocol: any,
    _host: any,
    _port: any,
    _method: any,
    _path: any,
    headers: Map<string, string>,
    _target: any,
    _body: any
  ) => {
    // record only the non-":*" headers
    acquired.push(
      Array.from(headers.entries())
    );
    return dummy;
  };

  // stub response.setConnectionClose (HttpsServer does this)
  (dummy.response as any).setConnectionClose = (_: boolean) => {};

  // wire up a fake pool that records both acquire & release
  (server as any).httpContextPool = {
    acquire: () => dummy,
    release: (ctx: HttpContext) => { released.push(ctx); }
  };

  // short-circuit the dispatcher
  (server as any).dispatchRequestAsync = () => Promise.resolve();

  // fake an HTTP/2 stream
  const fakeStream = new PassThrough() as any;
  fakeStream.destroy = (_?: any) => {};

  // emit the 'stream' event with pseudo-headers + one real header
  const headers = { ':method': 'GET', ':path': '/abc', 'x-test': 'value' };
  server['httpsServer'].emit('stream', fakeStream, headers);

  // wait a tick for the async handler to run
  await new Promise(r => setImmediate(r));

  // exactly one initialize ⇒ one acquisition
  t.assert.strictEqual(acquired.length, 1, 'should have initialized once');
  t.assert.deepStrictEqual(acquired[0], [['x-test', 'value']]);

  // exactly one release of that same context
  t.assert.strictEqual(released.length, 1, 'should have released once');
  t.assert.strictEqual(released[0], dummy);
});

test('HttpsServer: stream error and aborted handling emits events and destroys stream', async (context: TestContext) => {
  const events: any[] = [];
  const options = new WebServerOptions(
    { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
    { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
    { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
    (e: any) => events.push(e)
  );
  const server = new HttpsServer(options);

  // use a real HttpContext so we get the right shape
  const dummy = new HttpContext();
  // stub out its internals
  (dummy.request as any).initialize = () => dummy;
  (dummy.response as any).initialize = () => {};
  (dummy.response as any).setConnectionClose = () => {};

  // wire up a one-slot pool
  (server as any).httpContextPool = {
    acquire: () => dummy,
    release: () => {}
  };

  // short-circuit the dispatcher
  (server as any).dispatchRequestAsync = () => Promise.resolve(dummy);

  // fake an HTTP/2 stream
  const fakeStream = new PassThrough() as any;
  let destroyCount = 0;
  fakeStream.destroy = () => { destroyCount++; };

  // kick off the server’s 'stream' handler
  server['httpsServer'].emit('stream', fakeStream, {});

  // 1) Error path
  const err = new Error('stream-fail');
  fakeStream.emit('error', err);

  // give it a tick to run the handler
  await new Promise(resolve => setImmediate(resolve));

  context.assert.ok(
    events.some(e => e.type === 'error' && e.detail === err),
    'expected an error event'
  );
  context.assert.strictEqual(destroyCount, 1, 'stream.destroy should have been called once');

  // 2) Aborted path
  fakeStream.emit('aborted');

  // another tick
  await new Promise(resolve => setImmediate(resolve));

  context.assert.ok(
    events.some(e => e.type === 'warning' && /abort/i.test(String(e.detail))),
    'expected a warning event whose detail mentions "abort"'
  );
  context.assert.strictEqual(destroyCount, 2, 'stream.destroy should have been called twice');
});

test('HttpsServer: TLS server callback handles h2 and fallback protocols', (context: TestContext) => {
    let capturedOpts: any;
    let tlsCallback: (socket: any) => void;
    const fakeTlsServer = new EventEmitter();
    fakeTlsServer.on = fakeTlsServer.addListener.bind(fakeTlsServer);

    const originalTlsCreate = tls.createServer;
    (tls as any).createServer = (opts: any, cb: any) => {
        capturedOpts = opts;
        tlsCallback = cb;
        return fakeTlsServer as any;
    };

    const options = new WebServerOptions(
        { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        () => { }
    );
    class TestTlsServer extends HttpsServer {
        public handled: any[] = [];
        public secured: any[] = [];
        override handleSocket(sock: any) { this.handled.push(sock); }
    }

    const server = new TestTlsServer(options);
    const fakeHttp2Server = new EventEmitter();
    fakeHttp2Server.on = fakeHttp2Server.addListener.bind(fakeHttp2Server);
    fakeHttp2Server.on('secureConnection', (sock: any) => server.secured.push(sock));
    (server as any).httpsServer = fakeHttp2Server;

    context.assert.deepStrictEqual(capturedOpts.ALPNProtocols, ['h2', 'http/1.1']);

    const h2Socket = new EventEmitter() as any;
    h2Socket.setNoDelay = () => { h2Socket.nodelay = true; };
    h2Socket.alpnProtocol = 'h2';
    h2Socket.once = h2Socket.once.bind(h2Socket);
    (server as any).sockets.clear();

    tlsCallback!(h2Socket);
    context.assert.strictEqual(h2Socket.nodelay, true);
    context.assert.ok(server['sockets'].has(h2Socket));
    context.assert.strictEqual(server.secured[0], h2Socket);

    const http1Socket = new EventEmitter() as any;
    http1Socket.setNoDelay = () => { http1Socket.nodelay = true; };
    http1Socket.alpnProtocol = 'http/1.1';
    http1Socket.once = http1Socket.once.bind(http1Socket);

    tlsCallback!(http1Socket);
    context.assert.strictEqual(http1Socket.nodelay, true);
    context.assert.ok(server['sockets'].has(http1Socket));
    context.assert.strictEqual(server.handled[0], http1Socket);

    tls.createServer = originalTlsCreate;
});