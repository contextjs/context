/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { RouteConfiguration } from "../../src/extensions/route-configuration.js";
import { RouteOptions } from "../../src/extensions/route-options.js";
import { Route } from "../../src/models/route.js";

test("RouteOptions: discoverRoutes() should enable discovery by default", (context: TestContext) => {
    const config = new RouteConfiguration();
    const options = new RouteOptions(config);

    options.discoverRoutes();
    context.assert.strictEqual(config.discoverRoutes, true);
});

test("RouteOptions: discoverRoutes(false) should disable discovery", (context: TestContext) => {
    const config = new RouteConfiguration();
    const options = new RouteOptions(config);

    options.discoverRoutes(false);
    context.assert.strictEqual(config.discoverRoutes, false);
});

test("RouteOptions: discoverRoutes(true) should enable discovery", (context: TestContext) => {
    const config = new RouteConfiguration();
    const options = new RouteOptions(config);

    options.discoverRoutes(true);
    context.assert.strictEqual(config.discoverRoutes, true);
});

test("RouteOptions: useRoutes() should replace existing routes", (context: TestContext) => {
    const config = new RouteConfiguration();
    const options = new RouteOptions(config);
    const route1 = new Route("/r1");
    const route2 = new Route("/r2", "name");

    options.useRoutes([route1, route2]);

    context.assert.strictEqual(config.routes.length, 2);
    context.assert.strictEqual(config.routes[0].template, "/r1");
    context.assert.strictEqual(config.routes[1].name, "name");
});