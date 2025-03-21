/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Application } from "../src/application.ts";
import { EnvironmentName } from "../src/models/environment-name.ts";

test('Application: instance - success', (context: TestContext) => {
    const application = new Application();
    context.assert.ok(application instanceof Application);
});

test('Application: default environment - success', (context: TestContext) => {
    const application = new Application();
    context.assert.strictEqual(application.environment.name, EnvironmentName.development);
});

test('Application: onRun - success', async (context: TestContext) => {
    const application = new Application();
    const initialValue = 100;
    var valueFromRun = 10;

    application.onRun(async () => { valueFromRun = initialValue; });
    await application.runAsync();

    context.assert.strictEqual(valueFromRun, initialValue);
});