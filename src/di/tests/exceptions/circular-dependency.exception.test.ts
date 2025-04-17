/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CircularDependencyException } from '../../src/exceptions/circular-dependency.exception.js';
import { Exception } from '@contextjs/system';

test('CircularDependencyException: constructor - success', (context: TestContext) => {
    const dependencyName = 'TestDependency';
    const exception = new CircularDependencyException(dependencyName);
    const expectedMessage = `Circular dependency detected: ${dependencyName}.`;

    context.assert.equal(exception.name, 'CircularDependencyException');
    context.assert.equal(exception.message, expectedMessage);
    context.assert.ok(exception.stack);
    context.assert.ok(exception.stack.includes('CircularDependencyException'));

    context.assert.ok(exception instanceof CircularDependencyException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);

    context.assert.equal(exception.toString(), `CircularDependencyException: ${expectedMessage}`);
});