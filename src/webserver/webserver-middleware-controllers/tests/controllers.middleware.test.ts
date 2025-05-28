import { HttpContext, WebServer } from "@contextjs/webserver";
import test, { TestContext } from "node:test";
import { ControllersMiddleware } from "../src/controllers.middleware.js";
import { ActionExecutorService } from "../src/services/action-executor.service.js";

test("ControllersMiddleware: constructor sets default values", (context: TestContext) => {
    const webServer = {} as WebServer;
    const middleware = new ControllersMiddleware(webServer);

    context.assert.strictEqual(middleware.name, "ControllersMiddleware");
    context.assert.strictEqual(middleware.version, "1.0.0");
    context.assert.strictEqual(middleware.defaultController, "home");
    context.assert.strictEqual(middleware.defaultAction, "index");
    context.assert.strictEqual((middleware as any).webServer, webServer);
});

test("ControllersMiddleware: onRequest calls ActionExecutorService with expected arguments", async (context: TestContext) => {
    let called = false;

    const fakeWebServer = {} as WebServer;
    const fakeHttpContext = {} as HttpContext;

    const original = ActionExecutorService.executeAsync;
    ActionExecutorService.executeAsync = async (
        webServer: WebServer,
        httpContext: HttpContext,
        defaultController: string,
        defaultAction: string
    ) => {
        context.assert.strictEqual(webServer, fakeWebServer);
        context.assert.strictEqual(httpContext, fakeHttpContext);
        context.assert.strictEqual(defaultController, "home");
        context.assert.strictEqual(defaultAction, "index");
        called = true;
    };

    const middleware = new ControllersMiddleware(fakeWebServer);
    await middleware.onRequest(fakeHttpContext);

    context.assert.ok(called);

    ActionExecutorService.executeAsync = original;
});