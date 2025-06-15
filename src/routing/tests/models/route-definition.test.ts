/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import "reflect-metadata";
import { RouteDefinition } from "../../src/models/route-definition.js";
import { RouteInfo } from "../../src/models/route-info.js";

test("RouteDefinition: properties are set correctly", (context: TestContext) => {
    const routeInfo = new RouteInfo("/test/path", "testName");
    const definition = new RouteDefinition("TestController", "testHandler", routeInfo);

    context.assert.strictEqual(definition.className, "TestController");
    context.assert.strictEqual(definition.methodName, "testHandler");
    context.assert.strictEqual(definition.route, routeInfo);
});

test("RouteDefinition: supports null references", (context: TestContext) => {
    const routeInfo = new RouteInfo("/none", undefined);
    const definition = new RouteDefinition(null, null, routeInfo);

    context.assert.strictEqual(definition.className, null);
    context.assert.strictEqual(definition.methodName, null);
    context.assert.strictEqual(definition.route, routeInfo);
});