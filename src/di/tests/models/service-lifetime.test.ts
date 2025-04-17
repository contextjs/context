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

test('Service: accepts valid lifetime "singleton"', (context: TestContext) => {
    const parameter = new ConstructorParameter('param', String);
    const service = new Service(class {}, 'singleton', [parameter]);

    context.assert.strictEqual(service.lifetime, 'singleton');
});

test('Service: accepts valid lifetime "transient"', (context: TestContext) => {
    const parameter = new ConstructorParameter('param', Number);
    const service = new Service(class {}, 'transient', [parameter]);

    context.assert.strictEqual(service.lifetime, 'transient');
});
