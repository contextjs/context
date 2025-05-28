/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from '@contextjs/routing';
import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { ControllerDefinition } from '../../src/models/controller-definition.js';

class DummyClass { }

test('ControllerDefinition: default template uses controller name without suffix', (context: TestContext) => {
    const controllerDefinition = new ControllerDefinition('MyController', DummyClass);
    const template = (controllerDefinition.route as any).template;

    context.assert.strictEqual(controllerDefinition.name, 'MyController');
    context.assert.strictEqual(controllerDefinition.classReference, DummyClass);
    context.assert.ok(controllerDefinition.route instanceof RouteInfo);
    context.assert.strictEqual(template, 'my');
});

test('ControllerDefinition: non-controller name uses lowercase name directly', (context: TestContext) => {
    const controllerDefinition = new ControllerDefinition('User', DummyClass);
    const template = (controllerDefinition.route as any).template;

    context.assert.strictEqual(template, 'user');
});

test('ControllerDefinition: whitespace or empty template falls back to default name', (context: TestContext) => {
    const controllerDefinition1 = new ControllerDefinition('TestController', DummyClass, '   ');
    const template1 = (controllerDefinition1.route as any).template;
    const controllerDefinition2 = new ControllerDefinition('TestController', DummyClass, '');
    const template2 = (controllerDefinition2.route as any).template;

    context.assert.strictEqual(template2, 'test');
    context.assert.strictEqual(template1, 'test');
});

test('ControllerDefinition: trims slashes and normalizes template', (context: TestContext) => {
    const controllerDefinition = new ControllerDefinition('AnyController', DummyClass, '/api/v1/resource/');
    const template = (controllerDefinition.route as any).template;

    context.assert.strictEqual(template, 'api/v1/resource');
});

test('ControllerDefinition: replaces [controller] placeholder', (context: TestContext) => {
    const controllerDefinition = new ControllerDefinition('OrderController', DummyClass, 'area/[controller]/details');
    const template = (controllerDefinition.route as any).template;

    context.assert.strictEqual(template, 'area/order/details');
});