/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import '@contextjs/webserver';
import { IMiddleware, WebServerOptions } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { ControllersMiddleware } from '../../src/controllers.middleware.js';
import { ControllerOptions } from '../../src/extensions/controller.options.js';
import '../../src/extensions/webserver-options.extensions.js';
import { ControllerDiscoveryService } from '../../src/services/controller-discovery-service.js';

function createOptionsWithContext() {
    const applied: IMiddleware[] = [];
    const setCalls: Array<{ name: string; config: any }> = [];
    const fakeApp: any = {
        routes: undefined as any,
        useRouting() { this.routes = []; },
        useDependencyInjection() { },
        onRunCallbacks: [] as Function[],
        onRun(cb: Function) { this.onRunCallbacks.push(cb); },
        services: { dependenciesAccessor: { set: (name: string, config: any) => setCalls.push({ name, config }) } }
    };
    const fakeServer: any = {
        application: fakeApp,
        useMiddleware: (middleware: IMiddleware) => applied.push(middleware)
    };
    const options = new WebServerOptions();
    // @ts-ignore
    options.webServer = fakeServer;
    return { options, applied, fakeApp, setCalls };
}

test('useControllers: registers middleware with custom settings', (context: TestContext) => {
    const { options, applied } = createOptionsWithContext();
    const result = options.useControllers((options: ControllerOptions) => {
        options.defaultController = 'home';
        options.defaultAction = 'index';
    });
    const controllersMiddleware = applied[0] as ControllersMiddleware;

    context.assert.strictEqual(result, options);
    context.assert.strictEqual(applied.length, 1);
    context.assert.ok(controllersMiddleware instanceof ControllersMiddleware);
    context.assert.strictEqual(controllersMiddleware.defaultController, 'home');
    context.assert.strictEqual(controllersMiddleware.defaultAction, 'index');
});

test('useControllers: uses defaults when no callback is provided', (context: TestContext) => {
    const { options, applied } = createOptionsWithContext();
    // @ts-ignore
    options.useControllers();
    const controllersMiddleware = applied[0] as ControllersMiddleware;

    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(controllersMiddleware.defaultController, 'home');
    context.assert.strictEqual(controllersMiddleware.defaultAction, 'index');
});

test('useControllers: treats null callback as no-op and uses defaults', (context: TestContext) => {
    const { options, applied } = createOptionsWithContext();
    // @ts-ignore
    options.useControllers(null);
    const controllersMiddleware = applied[0] as ControllersMiddleware;

    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(controllersMiddleware.defaultController, 'home');
    context.assert.strictEqual(controllersMiddleware.defaultAction, 'index');
});

test('useControllers: allows partial configuration of ControllerOptions', (context: TestContext) => {
    const { options, applied } = createOptionsWithContext();
    options.useControllers((cfg: ControllerOptions) => { cfg.defaultAction = 'show'; });
    const controllersMiddleware = applied[0] as ControllersMiddleware;

    context.assert.strictEqual(applied.length, 1);
    context.assert.strictEqual(controllersMiddleware.defaultController, 'home');
    context.assert.strictEqual(controllersMiddleware.defaultAction, 'show');
});

test('useControllers: onRun registers routes and DI entries correctly', async (context: TestContext) => {
    const { options, fakeApp, setCalls } = createOptionsWithContext();
    class TestCtrl { }
    Reflect.defineMetadata('design:paramtypes', [Number, String], TestCtrl);
    const originalDiscover = ControllerDiscoveryService.discoverAsync;
    // @ts-ignore
    ControllerDiscoveryService.discoverAsync = () => Promise.resolve({
        routes: ['r1', 'r2'],
        controllers: [{ name: 'C1', classReference: TestCtrl }]
    });
    options.useControllers((options: ControllerOptions) => {
        options.defaultController = 'X';
        options.defaultAction = 'Y';
    });

    context.assert.deepStrictEqual(fakeApp.routes, []);
    await fakeApp.onRunCallbacks[0]();

    context.assert.deepStrictEqual(fakeApp.routes, ['r1', 'r2']);
    context.assert.strictEqual(setCalls.length, 1);
    const call = setCalls[0];
    context.assert.strictEqual(call.name, 'C1');
    context.assert.strictEqual(call.config.lifetime, 'transient');
    context.assert.strictEqual(call.config.type, TestCtrl);
    context.assert.deepStrictEqual(call.config.parameters, [
        { name: 'param0', type: Number },
        { name: 'param1', type: String }
    ]);

    // Cleanup
    ControllerDiscoveryService.discoverAsync = originalDiscover;
});
