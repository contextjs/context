/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Service } from '../../src/models/service.js';
import { ConstructorParameter } from '../../src/models/constructor-parameter.js';
import { ServiceLifetime } from '../../src/models/service-lifetime.js';

test('Service: constructor assigns type, lifetime, and parameters', (context: TestContext) => {
    const serviceType = class MyService {};
    const serviceLifetime: ServiceLifetime = 'singleton';
    const serviceParameters = [
        new ConstructorParameter('param1', String),
        new ConstructorParameter('param2', Number)
    ];

    const service = new Service(serviceType, serviceLifetime, serviceParameters);

    context.assert.strictEqual(service.type, serviceType);
    context.assert.strictEqual(service.lifetime, serviceLifetime);
    context.assert.deepStrictEqual(service.parameters, serviceParameters);
});
