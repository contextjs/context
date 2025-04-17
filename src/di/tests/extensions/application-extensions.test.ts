/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, NullReferenceException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import '../../src/extensions/application-extensions.js';
import { DependencyInjectionOptions } from '../../src/extensions/dependency-injection-options.js';
import { ServiceCollection } from '../../src/service-collection.js';

test('ApplicationExtension: useDependencyInjection: throws if options callback is null', (context: TestContext) => {
    const application = new Application();
    context.assert.throws(() => application.useDependencyInjection(null!), NullReferenceException);
    context.assert.throws(() => application.useDependencyInjection(undefined!), NullReferenceException);
});

test('ApplicationExtension: useDependencyInjection: attaches services to Application and sets onResolve', (context: TestContext) => {
    const application = new Application();
    let capturedOptions: DependencyInjectionOptions | null = null;

    const result = application.useDependencyInjection(options => {
        capturedOptions = options;
        options.onResolve = () => 'scoped-result';
    });

    context.assert.ok(application.services instanceof ServiceCollection);
    context.assert.strictEqual(application.services.onResolve, capturedOptions!.onResolve);
    context.assert.strictEqual(result, application);
});
