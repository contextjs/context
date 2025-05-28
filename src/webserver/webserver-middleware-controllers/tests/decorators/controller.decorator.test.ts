/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { Controller, getControllerMetadata } from '../../src/decorators/controller.decorator.js';

test('ControllerDecorator: getControllerMetadata returns undefined for undecorated class', (context: TestContext) => {
    class Undecorated { }
    context.assert.strictEqual(getControllerMetadata(Undecorated), undefined);
});

test('ControllerDecorator: Controller decorator without template sets controller metadata only', (context: TestContext) => {
    class NoTemplate { }
    Controller()(NoTemplate);

    context.assert.strictEqual(getControllerMetadata(NoTemplate), 'NoTemplate');
    context.assert.strictEqual(Reflect.getMetadata('controller:template', NoTemplate), undefined);
});

test('ControllerDecorator: Controller decorator with template sets both controller and template metadata', (context: TestContext) => {
    const template = 'my-template';
    class WithTemplate { }
    Controller(template)(WithTemplate);

    context.assert.strictEqual(getControllerMetadata(WithTemplate), 'WithTemplate');
    context.assert.strictEqual(Reflect.getMetadata('controller:template', WithTemplate), template);
});
