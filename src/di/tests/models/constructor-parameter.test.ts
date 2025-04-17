/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ConstructorParameter } from '../../src/models/constructor-parameter.js';

test('ConstructorParameter: constructor assigns name and type', (context: TestContext) => {
    const parameterName = 'logger';
    const paramType = String;

    const param = new ConstructorParameter(parameterName, paramType);

    context.assert.strictEqual(param.name, parameterName);
    context.assert.strictEqual(param.type, paramType);
});