/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception, SystemException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { DependencyInjectionException } from '../../src/exceptions/dependency-injection.exception.js';

test('DependencyInjectionException: constructor - success', (context: TestContext) => {
    const dependencyName = 'TestDependency';
    const exception = new DependencyInjectionException(dependencyName);

    context.assert.equal(exception.name, 'DependencyInjectionException');
    context.assert.equal(exception.message, dependencyName);
    context.assert.ok(exception.stack);
    context.assert.ok(exception.stack.includes('DependencyInjectionException'));

    context.assert.ok(exception instanceof DependencyInjectionException);
    context.assert.ok(exception instanceof SystemException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);

    context.assert.equal(exception.toString(), `DependencyInjectionException: ${dependencyName}`);
});