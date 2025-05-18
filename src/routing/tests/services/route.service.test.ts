/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { RouteInfo } from '../../src/models/route-info.ts';
import { RouteService } from '../../src/services/route.service.ts';

test('RouteService: match - invalid route', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/invalid', [route]);

    context.assert.strictEqual(foundRoute, null);
});

test('RouteService: match - template with special characters', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/details', 'homeDetails');
    const foundRoute = RouteService.match('home/123/details', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with query string', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'homeDetails');
    const foundRoute = RouteService.match('home/123?query=string', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with optional parameter', (context: TestContext) => {
    const route = new RouteInfo('home/{id?}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john', [route]);

    context.assert.strictEqual(foundRoute, null);
});

test('RouteService: match - template with multiple required parameters', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{name}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with mixed parameters', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{name?}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with mixed parameters and wildcard - partial match', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with mixed parameters and wildcard - partial match - query string', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details?query=string', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});


test('RouteService: match - template with mixed parameters and wildcard - partial match - valid route', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details/invalid', [route]);

    context.assert.strictEqual(foundRoute, route);
});

test('RouteService: match - template with mixed parameters and wildcard - partial match - trailing slash', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details/', [route]);

    context.assert.strictEqual(foundRoute, route);
});

test('RouteService: match - template with mixed parameters and wildcard - partial match - no trailing slash', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details', [route]);

    context.assert.strictEqual(foundRoute, route);
});

test('RouteService: match - template with mixed parameters and wildcard - partial match - encoded URI', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home%2F123/john/details', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - success', (context: TestContext) => {
    const route = new RouteInfo('home/index.html', 'home');
    const foundRoute = RouteService.match("home/index.html", [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - null value', (context: TestContext) => {
    context.assert.strictEqual(RouteService.match(null!, []), null);
});

test('RouteService: match - empty value', (context: TestContext) => {
    context.assert.strictEqual(RouteService.match('', []), null);
});

test('RouteService: match - empty routes', (context: TestContext) => {
    context.assert.strictEqual(RouteService.match('home/index.html', []), null);
});

test('RouteService: match - no match', (context: TestContext) => {
    const route = new RouteInfo('home/index.html', 'home');
    context.assert.strictEqual(RouteService.match('home/about.html', [route]), null);
});

test('RouteService: match - wildcard match', (context: TestContext) => {
    const route = new RouteInfo('home/{*}', 'home');
    const foundRoute = RouteService.match('home/about.html', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - optional parameter match', (context: TestContext) => {
    const route = new RouteInfo('home/{id?}', 'home');
    const foundRoute = RouteService.match('home/123', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - required parameter match', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'home');
    const foundRoute = RouteService.match('home/123', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - multiple routes', (context: TestContext) => {
    const route1 = new RouteInfo('home/{id}', 'home');
    const route2 = new RouteInfo('home/{*}', 'homeWildcard');
    const foundRoute = RouteService.match('home/about.html', [route1, route2]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route2.template);
});

test('RouteService: match - multiple segments', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/details', 'homeDetails');
    const foundRoute = RouteService.match('home/123/details', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - no trailing slash', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/', [route]);

    context.assert.strictEqual(foundRoute, route);
});

test('RouteService: match - trailing slash', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/', 'homeDetails');
    const foundRoute = RouteService.match('home/123', [route]);

    context.assert.strictEqual(foundRoute, null);
});

test('RouteService: match - query string', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'homeDetails');
    const foundRoute = RouteService.match('home/123?query=string', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - encoded URI', (context: TestContext) => {
    const route = new RouteInfo('home/{id}', 'homeDetails');
    const foundRoute = RouteService.match('home%2F123', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - throws NullreferenceException', (context: TestContext) => {
    context.assert.throws(() => { new RouteInfo('', 'homeDetails') }, NullReferenceException);
});

test('RouteService: match - template with multiple optional parameters', (context: TestContext) => {
    const route = new RouteInfo('home/{id?}/{name?}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with optional parameter missing', (context: TestContext) => {
    const route = new RouteInfo('home/{id?}/{name?}', 'homeDetails');
    const foundRoute = RouteService.match('home', [route]);

    context.assert.notStrictEqual(foundRoute, null);
    context.assert.strictEqual(foundRoute!.template, route.template);
});

test('RouteService: match - template with mixed parameters and wildcard', (context: TestContext) => {
    const route = new RouteInfo('home/{id}/{*}', 'homeDetails');
    const foundRoute = RouteService.match('home/123/john/details?query=string', [route]);

    context.assert.strictEqual(foundRoute, route);
});