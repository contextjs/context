/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from '@contextjs/routing';
import { HttpVerb } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { VerbRouteInfo } from '../../src/models/verb-route-info.js';

test('VerbRouteInfo: initializes verb and template properties', (context: TestContext) => {
    const verb: HttpVerb = 'POST';
    const template = 'api/test';
    const verbRoute = new VerbRouteInfo(verb, template);

    context.assert.ok(verbRoute instanceof RouteInfo);
    context.assert.ok(verbRoute instanceof VerbRouteInfo);
    context.assert.strictEqual(verbRoute.verb, verb);
    context.assert.strictEqual((verbRoute as any).template, template);
});

test('VerbRouteInfo: supports all HTTP verbs', (context: TestContext) => {
    const verbs: HttpVerb[] = ['GET', 'POST', 'PUT', 'DELETE'];
    const template = '/path';
    verbs.forEach(verb => {
        const verbRouteInfo = new VerbRouteInfo(verb, template);
        context.assert.strictEqual(verbRouteInfo.verb, verb);
        context.assert.strictEqual((verbRouteInfo as any).template, template);
    });
});