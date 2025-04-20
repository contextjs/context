
/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from "@contextjs/system";
import test, { TestContext } from "node:test";
import "../../src/extensions/application-extensions.js";
import { RouteConfiguration } from "../../src/extensions/route-configuration.js";
import { RouteOptions } from "../../src/extensions/route-options.js";

test("Application: useRouting() should initialize routeConfiguration", (context: TestContext) => {
    const app = new Application();
    app.useRouting(() => { });
    context.assert.ok(app.routeConfiguration);
    context.assert.strictEqual(app.routeConfiguration instanceof RouteConfiguration, true);
});

test("Application: useRouting() should invoke builder callback", (context: TestContext) => {
    let called = false;
    const app = new Application();
    app.useRouting(() => { called = true; });
    context.assert.strictEqual(called, true);
});

test("Application: useRouting() should configure RouteOptions with RouteConfiguration", (context: TestContext) => {
    let received: RouteOptions | null = null;
    const app = new Application();
    app.useRouting(opts => received = opts);
    context.assert.ok(received);
    context.assert.strictEqual(Object.getPrototypeOf(received)?.constructor?.name, "RouteOptions");

});
