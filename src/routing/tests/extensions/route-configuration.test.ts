/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { RouteConfiguration } from "../../src/extensions/route-configuration.js";
import { RouteInfo } from "../../src/models/route-info.js";

test("RouteConfiguration: should initialize with empty route list", (context: TestContext) => {
    const config = new RouteConfiguration();
    context.assert.strictEqual(Array.isArray(config.routes), true);
    context.assert.strictEqual(config.routes.length, 0);
});

test("RouteConfiguration: should allow setting discoverRoutes", (context: TestContext) => {
    const config = new RouteConfiguration();
    context.assert.strictEqual(config.discoverRoutes, false);

    config.discoverRoutes = true;
    context.assert.strictEqual(config.discoverRoutes, true);
});

test("RouteConfiguration: should allow pushing routes manually", (context: TestContext) => {
    const config = new RouteConfiguration();
    const route = new RouteInfo("/test");

    config.routes.push(route);

    context.assert.strictEqual(config.routes.length, 1);
    context.assert.strictEqual(config.routes[0].template, "/test");
    context.assert.strictEqual(config.routes[0].name, null);
});
