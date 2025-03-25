/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { EnvironmentName } from "../../src/models/environment-name.ts";
import { Environment } from "../../src/models/environment.ts";

test('Environment: isDevelopment - success', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;

    context.assert.strictEqual(environment.isDevelopment, true);
});

test('Environment: isDevelopment - failure', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.production;

    context.assert.strictEqual(environment.isDevelopment, false);
});

test('Environment: isProduction - success', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.production;

    context.assert.strictEqual(environment.isProduction, true);
});

test('Environment: isProduction - failure', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;

    context.assert.strictEqual(environment.isProduction, false);
});

test('Environment: isTest - success', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.test;

    context.assert.strictEqual(environment.isTest, true);
});

test('Environment: isTest - failure', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;

    context.assert.strictEqual(environment.isTest, false);
});

test('Environment: isStaging - success', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.staging;

    context.assert.strictEqual(environment.isStaging, true);
});

test('Environment: isStaging - failure', (context: TestContext) => {
    const environment = new Environment();
    environment.name = EnvironmentName.development;

    context.assert.strictEqual(environment.isStaging, false);
});

test('Environment: getEnvironment - success', (context: TestContext) => {
    process.argv = ['node', 'app', '--environment', 'production'];
    const environment1 = new Environment();

    context.assert.strictEqual(environment1.name, EnvironmentName.production);

    process.argv = ['node', 'app', '-e', 'production'];
    const environment2 = new Environment();

    context.assert.strictEqual(environment2.name, EnvironmentName.production);
});