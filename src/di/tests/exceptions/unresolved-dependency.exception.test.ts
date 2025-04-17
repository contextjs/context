/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { UnresolvedDependencyException } from '../../src/exceptions/unresolved-dependency.exception.js';

test('UnresolvedDependencyException: constructor - success', (context: TestContext) => {
    const parameterName = 'myService';
    const parameterType = 'IMyService';
    const targetName = 'MyController';

    const exception = new UnresolvedDependencyException(parameterName, parameterType, targetName);
    const expectedMessage = `Unresolved dependency "${parameterName}" of type "${parameterType}" for service "${targetName}".`;

    context.assert.equal(exception.name, 'UnresolvedDependencyException');
    context.assert.equal(exception.message, expectedMessage);
    context.assert.ok(exception.stack);
    context.assert.ok(exception.stack.includes('UnresolvedDependencyException'));

    context.assert.ok(exception instanceof UnresolvedDependencyException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);

    context.assert.equal(exception.toString(), `UnresolvedDependencyException: ${expectedMessage}`);
});
