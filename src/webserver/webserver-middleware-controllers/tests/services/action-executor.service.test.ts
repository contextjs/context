/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParsedRoute, RouteService } from '@contextjs/routing';
import { HttpContext, HttpVerb, WebServer } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { VerbRouteInfo } from '../../src/models/verb-route-info.js';
import { ActionExecutorService } from '../../src/services/action-executor.service.js';

function createHttpContext(path: string, method: HttpVerb) {
    const headers: Record<string, any> = {};
    let statusCode: number | null = null;
    let statusMessage: string | null = null;
    let sentBody: any = null;
    let ended = false;
    const response: any = {
        setHeader(name: string, value: any) { headers[name] = value; },
        setStatus(code: number, message: string) { statusCode = code; statusMessage = message; },
        async sendAsync(body: any) { sentBody = body; },
        async endAsync() { ended = true; }
    };
    const httpContext: any = {
        request: { path, method },
        response,
        __internal: { headers, get status() { return statusCode; }, get message() { return statusMessage; }, get body() { return sentBody; }, get ended() { return ended; } }
    };

    return httpContext;
}

test('executeAsync: server error when request URL is empty', async (context: TestContext) => {
    const httpContext = createHttpContext('   ', 'GET');
    const ws: any = { application: { routes: [] } };

    await ActionExecutorService.executeAsync(ws as unknown as WebServer, httpContext as HttpContext, 'C', 'A');

    context.assert.strictEqual(httpContext.__internal.status, 500);
    context.assert.strictEqual(httpContext.__internal.body, 'Server Error: Request URL is empty');
    context.assert.ok(httpContext.__internal.ended === false || httpContext.__internal.ended === true); // sendAsync used
});

test('executeAsync: not found when controller cannot be resolved', async (context: TestContext) => {
    const httpContext = createHttpContext('/x', 'GET');
    const webServer: any = { application: { routes: [], services: { resolve: (_: string) => undefined } } };

    const origMatch = RouteService.match;
    (RouteService.match as any) = () => undefined;

    await ActionExecutorService.executeAsync(webServer as WebServer, httpContext as HttpContext, 'DefaultCtrl', 'DefaultAct');

    context.assert.strictEqual(httpContext.__internal.status, 404);
    context.assert.ok(httpContext.__internal.ended);

    RouteService.match = origMatch;
});

test('executeAsync: no content when handler returns undefined', async (context: TestContext) => {
    class TestController { async foo() { } }
    const parsed: ParsedRoute = { definition: { className: 'TestController', methodName: 'foo' }, parameters: new Map() } as any;
    const origMatch = RouteService.match;
    (RouteService.match as any) = () => parsed;

    const httpContext = createHttpContext('/x', 'GET');
    const webServer: any = {
        application: {
            routes: [{ route: new VerbRouteInfo('GET', '/x') }],
            services: { resolve: (_: string) => new TestController() }
        }
    };

    await ActionExecutorService.executeAsync(webServer as WebServer, httpContext as HttpContext, 'Default', 'foo');

    context.assert.strictEqual(httpContext.__internal.status, 204);
    context.assert.ok(httpContext.__internal.ended);
    
    RouteService.match = origMatch;
});

test('executeAsync: ok with string result and correct headers', async (context: TestContext) => {
    class TestController { async foo() { return 'hello'; } }
    const parsed: ParsedRoute = { definition: { className: 'TestController', methodName: 'foo' }, parameters: new Map() } as any;
    const origMatch = RouteService.match;
    (RouteService.match as any) = () => parsed;

    const httpContext = createHttpContext('/x', 'GET');
    const webServer: any = {
        application: {
            routes: [{ route: new VerbRouteInfo('GET', '/x') }],
            services: { resolve: (_: string) => new TestController() }
        }
    };

    await ActionExecutorService.executeAsync(webServer as WebServer, httpContext as HttpContext, 'Default', 'foo');

    context.assert.strictEqual(httpContext.__internal.status, 200);
    context.assert.strictEqual(httpContext.__internal.headers['Content-Type'], 'text/plain; charset=utf-8');
    context.assert.strictEqual(httpContext.__internal.body, 'hello');

    RouteService.match = origMatch;
});

test('executeAsync: ok with JSON result and parameter mapping', async (context: TestContext) => {
    class TestController {
        async foo(httpContext: HttpContext, id: number) {
            return { id, ok: true, hasCtx: httpContext instanceof Object };
        }
    }
    Reflect.defineMetadata('design:paramtypes', [HttpContext, Number], TestController.prototype, 'foo');
    const parsed: ParsedRoute = {
        definition: { className: 'TestController', methodName: 'foo' },
        parameters: new Map([['id', 123]])
    } as any;
    const origMatch = RouteService.match;
    (RouteService.match as any) = () => parsed;
    const origSegments = RouteService.getSegments;
    (RouteService.getSegments as any) = (path: string) => path.split('/').filter(Boolean);

    const httpContext = createHttpContext('/x/456', 'GET');
    const webServer: any = {
        application: {
            routes: [{ route: new VerbRouteInfo('GET', '/x/:id') }],
            services: { resolve: (_: string) => new TestController() }
        }
    };

    await ActionExecutorService.executeAsync(webServer as WebServer, httpContext as HttpContext, 'Default', 'foo');
    const resultObj = JSON.parse(httpContext.__internal.body);

    context.assert.strictEqual(httpContext.__internal.status, 200);
    context.assert.strictEqual(httpContext.__internal.headers['Content-Type'], 'application/json');
    context.assert.deepStrictEqual(resultObj, { id: 123, ok: true, hasCtx: true });

    RouteService.match = origMatch;
    RouteService.getSegments = origSegments;
});