/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { test, TestContext } from 'node:test';
import { ControllerOptions } from '../../src/extensions/controller.options.js';

test('ControllerOptions: constructor - success', async (context: TestContext) => {
    const controllerOptions = new ControllerOptions();
    controllerOptions.defaultController = 'home';
    controllerOptions.defaultAction = 'index';

    context.assert.strictEqual(controllerOptions.defaultController, 'home');
    context.assert.strictEqual(controllerOptions.defaultAction, 'index');
});

test("ControllerOptions: default values", (context: TestContext) => {
    const options = new ControllerOptions();

    context.assert.strictEqual(options.defaultController, "home");
    context.assert.strictEqual(options.defaultAction, "index");
});