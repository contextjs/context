/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import "reflect-metadata";
import { VERB_ROUTE_META } from "../../src/decorators/verb-decorator.js";
import { ControllerDefinition } from "../../src/models/controller-definition.js";
import { VerbRouteInfo } from "../../src/models/verb-route-info.js";
import { VerbRouteDiscoveryService } from "../../src/services/verb-route-discovery-service.js";

function createDummyController(template: string | null): ControllerDefinition {
    class DummyController { }

    Reflect.defineMetadata("controller:template", template, DummyController);

    return new ControllerDefinition(
        "DummyController",
        DummyController,
        template ?? undefined
    );
}


test("VerbRouteDiscoveryService: discoverAsync returns matching routes with verb metadata", async (context: TestContext) => {
    class DummyController { public async handler() { } }
    Reflect.defineMetadata(VERB_ROUTE_META, { template: "test", verb: "GET" }, DummyController.prototype.handler);

    const imported = { DummyController };
    const controller = createDummyController("api");

    const result = await VerbRouteDiscoveryService.discoverAsync(imported, "dummy-path", controller);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].className, "DummyController");
    context.assert.strictEqual(result[0].methodName, "handler");
    context.assert.ok(result[0].route instanceof VerbRouteInfo);
    context.assert.strictEqual(result[0].route.template, "api/test");
});

test("VerbRouteDiscoveryService: discoverAsync skips methods without metadata", async (context: TestContext) => {
    class DummyController { handler() { } }
    const imported = { DummyController };
    const controller = createDummyController("api");

    const result = await VerbRouteDiscoveryService.discoverAsync(imported, "dummy-path", controller);

    context.assert.strictEqual(result.length, 0);
});

test("VerbRouteDiscoveryService: discoverAsync handles missing controller template", async (context: TestContext) => {
    class DummyController { public handler() { } }
    Reflect.defineMetadata(VERB_ROUTE_META, { template: "test", verb: "POST" }, DummyController.prototype.handler);
    const imported = { DummyController };
    const controller = createDummyController(null);

    const result = await VerbRouteDiscoveryService.discoverAsync(imported, "dummy-path", controller);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].route.template, "dummy/test");
});

test("VerbRouteDiscoveryService: discoverAsync handles absolute method template", async (context: TestContext) => {
    class DummyController { public handler() { } }
    Reflect.defineMetadata(VERB_ROUTE_META, { template: "/absolute", verb: "POST" }, DummyController.prototype.handler);
    const imported = { DummyController };
    const controller = createDummyController("api");

    const result = await VerbRouteDiscoveryService.discoverAsync(imported, "dummy-path", controller);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0].route.template, "/absolute");
});

test("VerbRouteDiscoveryService: discoverAsync skips constructor property", async (context: TestContext) => {
    const imported = { DummyController: class DummyController { } };
    const controller = createDummyController("api");

    const result = await VerbRouteDiscoveryService.discoverAsync(imported, "dummy-path", controller);

    context.assert.strictEqual(result.length, 0);
});