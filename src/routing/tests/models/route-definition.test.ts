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
    class DummyController { }
    async function dummyHandler() { return 42; }

    const routeInfo = new RouteInfo("/test/path", "testName");
    const definition = new RouteDefinition("/some/import/path.js", DummyController, dummyHandler, routeInfo);

    context.assert.strictEqual(definition.importPath, "/some/import/path.js");
    context.assert.strictEqual(definition.classReference, DummyController);
    context.assert.strictEqual(definition.methodReference, dummyHandler);
    context.assert.strictEqual(definition.route, routeInfo);
});

test("RouteDefinition: methodReference can be invoked on class instance", async (context: TestContext) => {
    class Greeter {
        async greet(name: string) {
            return `Hello, ${name}!`;
        }
    }

    const routeInfo = new RouteInfo("/greet", null);
    const definition = new RouteDefinition("/import/path/greeter.js", Greeter, Greeter.prototype.greet, routeInfo);
    const instance = new Greeter();
    const result = await definition.methodReference!.call(instance, "World");

    context.assert.strictEqual(result, "Hello, World!");
});

test("RouteDefinition: supports null references", (context: TestContext) => {
    const routeInfo = new RouteInfo("/none", undefined);
    const definition = new RouteDefinition("relative/path.js", null, null, routeInfo);

    context.assert.strictEqual(definition.importPath, "relative/path.js");
    context.assert.strictEqual(definition.classReference, null);
    context.assert.strictEqual(definition.methodReference, null);
    context.assert.strictEqual(definition.route, routeInfo);
});