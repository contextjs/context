/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import assert from "node:assert";
import test from "node:test";
import "reflect-metadata";

import { Application } from "@contextjs/system";
import "../../src/extensions/application-extensions.js";
import { RouteDefinition } from "../../src/models/route-definition.js";
import { RouteInfo } from "../../src/models/route-info.js";
import { RouteDiscoveryService } from "../../src/services/route-discovery-service.js";

test("Application: useRouting registers onRun handler that populates app.routes", async () => {
    const originalDiscover = RouteDiscoveryService.discoverRoutesAsync;
    try {
        class DummyController {
            async dummyMethod() { return "ok"; }
        }
        const dummyRouteInfo = new RouteInfo("/dummy", "dummyName");
        const dummyRoutes = [
            new RouteDefinition(
                "file:///dummy/path/controller.js",
                DummyController,
                DummyController.prototype.dummyMethod,
                dummyRouteInfo
            )
        ];
        RouteDiscoveryService.discoverRoutesAsync = async () => dummyRoutes;

        const app = new Application();
        assert.strictEqual((app as any).routes, undefined);

        app.useRouting();
        await app.runAsync();

        assert.deepStrictEqual(
            (app as any).routes,
            dummyRoutes,
            "app.routes should equal the stubbed dummyRoutes"
        );
    }
    finally {

        RouteDiscoveryService.discoverRoutesAsync = originalDiscover;
    }
});
