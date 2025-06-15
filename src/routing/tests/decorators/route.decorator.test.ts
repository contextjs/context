import test, { TestContext } from "node:test";
import "reflect-metadata";
import { Route, ROUTE_META } from "../../src/decorators/route.decorator.js";

test("RouteDecorator: attaches metadata correctly", (context: TestContext) => {
    class Test { action() { } }
    const descriptor = Object.getOwnPropertyDescriptor(Test.prototype, "action");
    Route("/test-path", "testName")(Test.prototype, "action", descriptor!);
    const meta = Reflect.getMetadata(ROUTE_META, descriptor!.value);

    context.assert.ok(meta, "Metadata should have been defined");
    context.assert.strictEqual(meta.template, "/test-path");
    context.assert.strictEqual(meta.name, "testName");
    context.assert.notStrictEqual(descriptor, null);
});
