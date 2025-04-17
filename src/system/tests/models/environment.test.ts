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

test('Environment: isDevelopment', (context: TestContext) => {
    const environment = new Environment([]);
    environment.name = EnvironmentName.development;
    context.assert.ok(environment.isDevelopment);

    environment.name = EnvironmentName.production;
    context.assert.ok(!environment.isDevelopment);
});

test('Environment: isProduction', (context: TestContext) => {
    const environment = new Environment([]);
    environment.name = EnvironmentName.production;
    context.assert.ok(environment.isProduction);

    environment.name = EnvironmentName.development;
    context.assert.ok(!environment.isProduction);
});

test('Environment: isTest', (context: TestContext) => {
    const environment = new Environment([]);
    environment.name = EnvironmentName.test;
    context.assert.ok(environment.isTest);

    environment.name = EnvironmentName.development;
    context.assert.ok(!environment.isTest);
});

test('Environment: isStaging', (context: TestContext) => {
    const environment = new Environment([]);
    environment.name = EnvironmentName.staging;
    context.assert.ok(environment.isStaging);

    environment.name = EnvironmentName.development;
    context.assert.ok(!environment.isStaging);
});

test('Environment: parses --environment and -e', (context: TestContext) => {
    const env1 = new Environment(['--environment', 'production']);
    context.assert.strictEqual(env1.name, EnvironmentName.production);

    const env2 = new Environment(['-e', 'test']);
    context.assert.strictEqual(env2.name, EnvironmentName.test);
});

test('Environment: parses mixed case values', (context: TestContext) => {
    const environment = new Environment(['--environment', 'PrOdUcTiOn']);
    context.assert.strictEqual(environment.name, EnvironmentName.production);
});

test('Environment: fallback to development when no environment is given', (context: TestContext) => {
    const environment = new Environment(['--unknown', 'value']);
    context.assert.strictEqual(environment.name, EnvironmentName.development);
});

test('Environment: toString returns name', (context: TestContext) => {
    const environment = new Environment(['--environment', 'staging']);
    context.assert.strictEqual(environment.toString(), EnvironmentName.staging);
});

test('Environment: setter normalizes case', (context: TestContext) => {
    const environment = new Environment([]);
    environment.name = 'PrOdUcTiOn';
    context.assert.strictEqual(environment.name, EnvironmentName.production);
    context.assert.ok(environment.isProduction);
});

test('Environment: extracts environment value from arguments', (context: TestContext) => {
    const environment = new Environment(['--environment', 'sTagiNg']);
    context.assert.strictEqual(environment.name, EnvironmentName.staging);
});