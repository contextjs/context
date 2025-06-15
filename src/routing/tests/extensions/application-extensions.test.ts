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
        class TestController {
            async testMethod() { return "ok"; }
        }
        const testRouteInfo = new RouteInfo("/test", "testName");
        const testRoutes = [
            new RouteDefinition(
                "file:///test/path/controller.js",
                TestController,
                TestController.prototype.testMethod,
                testRouteInfo
            )
        ];
        RouteDiscoveryService.discoverRoutesAsync = async () => testRoutes;

        const app = new Application();
        assert.strictEqual((app as any).routes, undefined);

        app.useRouting();
        await app.runAsync();

        assert.deepStrictEqual(
            (app as any).routes,
            testRoutes,
            "app.routes should equal the stubbed testRoutes"
        );
    }
    finally {

        RouteDiscoveryService.discoverRoutesAsync = originalDiscover;
    }
});
