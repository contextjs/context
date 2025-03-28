import { Application } from "@contextjs/core";
import { test, TestContext } from 'node:test';
import '../../src/extensions/application-extensions.js';

test('Application: useConfiguration - success', (context: TestContext) => {
    const app = new Application();
    app.useConfiguration(() => { });

    context.assert.notStrictEqual(app.configuration, null);
});