/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
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
    let valueFromRun = 10;

    application.onRun(async () => { valueFromRun = initialValue });
    await application.runAsync();

    context.assert.strictEqual(valueFromRun, initialValue);
});

test('Application: onRun - multiple functions run', async (context: TestContext) => {
    const application = new Application();

    const results: string[] = [];

    application
        .onRun(async () => results.push('first'))
        .onRun(async () => results.push('second'));

    await application.runAsync();

    context.assert.deepStrictEqual(results.sort(), ['first', 'second'].sort());
});

test('Application: onRun - handles async delays', async (context: TestContext) => {
    const application = new Application();

    const results: string[] = [];

    application
        .onRun(async () => {
            await new Promise(r => setTimeout(r, 20));
            results.push('delayed');
        })
        .onRun(async () => results.push('immediate'));

    await application.runAsync();

    context.assert.deepStrictEqual(results.sort(), ['immediate', 'delayed'].sort());
});