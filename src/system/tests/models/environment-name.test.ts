/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { EnvironmentName } from "../../src/models/environment-name.js";

test('EnvironmentName: development - success', (context: TestContext) => {
    context.assert.strictEqual(EnvironmentName.development, 'development');
});

test('EnvironmentName: production - success', (context: TestContext) => {
    context.assert.strictEqual(EnvironmentName.production, 'production');
});

test('EnvironmentName: test - success', (context: TestContext) => {
    context.assert.strictEqual(EnvironmentName.test, 'test');
});

test('EnvironmentName: staging - success', (context: TestContext) => {
    context.assert.strictEqual(EnvironmentName.staging, 'staging');
});