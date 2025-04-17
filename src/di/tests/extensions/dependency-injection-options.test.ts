/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';

import { DependencyInjectionOptions } from '../../src/extensions/dependency-injection-options.js';
import { ConstructorParameter } from '../../src/models/constructor-parameter.js';
import { Service } from '../../src/models/service.js';

test('DependencyInjectionOptions: default constructor - no onResolve set', (context: TestContext) => {
    const options = new DependencyInjectionOptions();
    context.assert.strictEqual(options.onResolve, undefined);
});

test('DependencyInjectionOptions: onResolve - assignment and invocation', (context: TestContext) => {
    const mockParam = new ConstructorParameter('param', String);
    const mockService = new Service(class { }, 'singleton', [mockParam]);

    const options = new DependencyInjectionOptions();
    let called = false;

    options.onResolve = ({ name, lifetime, parameters, service }) => {
        called = true;
        context.assert.strictEqual(name, 'TestService');
        context.assert.strictEqual(lifetime, 'singleton');
        context.assert.deepEqual(parameters, [mockParam]);
        context.assert.strictEqual(service, mockService);
        return 'mocked';
    };

    const result = options.onResolve!({
        name: 'TestService',
        lifetime: 'singleton',
        parameters: [mockParam],
        service: mockService
    });

    context.assert.strictEqual(called, true);
    context.assert.strictEqual(result, 'mocked');
});
