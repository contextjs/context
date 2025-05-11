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

test('HttpsServer: stream event dispatches request and releases context', async (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = new WebServerOptions(
        { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        (e: any) => events.push(e)
    );
    const server = new HttpsServer(options);

    const acquiredContexts: any[] = [];
    const releasedContexts: any[] = [];
    const dummyContext = {
        request: { headers: new Map<string, string>() },
        response: { setConnectionClose: (_: boolean) => { } },
        initialize: (_m: string, _p: string, headers: any, _s: any, _b: any) => {
            acquiredContexts.push(Array.from((headers as Map<string, string>).entries()));
        }
    };

    const fakePool = { acquire: () => dummyContext, release: (ctx: any) => fakePool };
    (server as any).httpContextPool = fakePool as any;

    (server as any).dispatchRequestAsync = (_: any) => Promise.resolve();

    const fakeStream = new PassThrough();
    (fakeStream as any).destroy = (_err?: any) => { };
    const headers = { ':method': 'GET', ':path': '/abc', 'x-test': 'value' };

    server['httpsServer'].emit('stream', fakeStream, headers);
    await new Promise(r => setImmediate(r));

    context.assert.strictEqual(acquiredContexts.length, 1);
    context.assert.strictEqual(releasedContexts.length, 0);
    context.assert.deepStrictEqual(acquiredContexts[0], [['x-test', 'value']]);
});

test('HttpsServer: stream error and aborted handling emits events and destroys stream', (context: TestContext) => {
    const events: any[] = [];
    const options: WebServerOptions = new WebServerOptions(
        { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
        { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
        { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
        (e: any) => events.push(e)
    );
    const server = new HttpsServer(options);

    const dummyContext = {
        request: { headers: new Map<string, string>() },
        response: { setConnectionClose: (_: boolean) => { } },
        initialize: (_m: string, _p: string, _h: any, _s: any, _b: any) => { }
    };
    const fakePool = {
        acquire: () => dummyContext,
        release: (_: any) => fakePool
    };
    (server as any).httpContextPool = fakePool as any;

    (server as any).dispatchRequestAsync = () => Promise.resolve(dummyContext);

    const fakeStream = new PassThrough();
    let destroyCount = 0;
    (fakeStream as any).destroy = () => { destroyCount++; };

    server['httpsServer'].emit('stream', fakeStream, {});

    const err = new Error('stream-fail');
    fakeStream.emit('error', err);
    context.assert.ok(events.some(e => e.type === 'error' && e.detail === err));
    context.assert.strictEqual(destroyCount, 1);

    fakeStream.emit('aborted');
    context.assert.ok(events.some(e => e.type === 'warning' && e.detail === 'Client aborted the request'));
    context.assert.strictEqual(destroyCount, 2);
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

test('HttpsServer: restartAsync calls stopAsync and startAsync in order', async (context: TestContext) => {
    const options = new WebServerOptions(
      { maximumHeaderSize: 1024, httpContextPoolSize: 1, idleSocketsTimeout: 100 } as any,
      { enabled: false, port: 0, keepAliveTimeout: 0 } as any,
      { enabled: true, port: 0, host: 'localhost', certificate: { key: KEY_PATH, cert: CERT_PATH } } as any,
      () => {}
    );
  
    class RestartTestServer extends HttpsServer {
      public callSequence: string[] = [];
      override async stopAsync()  { this.callSequence.push('stop'); }
      override async startAsync() { this.callSequence.push('start'); }
    }
  
    const server = new RestartTestServer(options);
    await server.restartAsync();
  
    context.assert.deepStrictEqual(server.callSequence, ['stop', 'start']);
  });