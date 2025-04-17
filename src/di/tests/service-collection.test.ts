/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CircularDependencyException } from '../src/exceptions/circular-dependency.exception.js';
import { UnresolvedDependencyException } from '../src/exceptions/unresolved-dependency.exception.js';
import { ServiceCollection } from '../src/service-collection.js';

class TestService { }
class AnotherService { }
class CompositeService {
    constructor(public a: TestService, public b: AnotherService) { }
}

test('ServiceCollection: resolve() returns null for unregistered service', (context: TestContext) => {
    const container = new ServiceCollection();
    const result = container.resolve('NonExistent');
    context.assert.strictEqual(result, null);
});

test('ServiceCollection: resolve() instantiates transient service each time', (context: TestContext) => {
    const container = new ServiceCollection();
    container.dependenciesAccessor.set('Service', {
        lifetime: 'transient',
        type: TestService,
        parameters: []
    });

    const instance1 = container.resolve('Service');
    const instance2 = container.resolve('Service');

    context.assert.notStrictEqual(instance1, instance2);
});

test('ServiceCollection: resolve() returns same instance for singleton service', (context: TestContext) => {
    const container = new ServiceCollection();
    container.dependenciesAccessor.set('Service', {
        lifetime: 'singleton',
        type: TestService,
        parameters: []
    });

    const instance1 = container.resolve('Service');
    const instance2 = container.resolve('Service');

    context.assert.strictEqual(instance1, instance2);
});

test('ServiceCollection: resolve() resolves service with no parameters', (context: TestContext) => {
    const container = new ServiceCollection();
    container.dependenciesAccessor.set('Service', {
        lifetime: 'singleton',
        type: TestService,
        parameters: []
    });

    const instance = container.resolve('Service');
    context.assert.ok(instance instanceof TestService);
});

test('ServiceCollection: resolve() resolves service with registered dependencies', (context: TestContext) => {
    const container = new ServiceCollection();
    container.dependenciesAccessor.set('A', {
        lifetime: 'singleton',
        type: TestService,
        parameters: []
    });
    container.dependenciesAccessor.set('B', {
        lifetime: 'singleton',
        type: AnotherService,
        parameters: []
    });
    container.dependenciesAccessor.set('C', {
        lifetime: 'singleton',
        type: CompositeService,
        parameters: [
            { name: 'a', type: 'A' },
            { name: 'b', type: 'B' }
        ]
    });

    const instance = container.resolve('C');
    context.assert.ok(instance instanceof CompositeService);
    context.assert.ok(instance.a instanceof TestService);
    context.assert.ok(instance.b instanceof AnotherService);
});

test('ServiceCollection: resolve() throws CircularDependencyException', (context: TestContext) => {
    class A { constructor(_: any) { } }
    class B { constructor(_: any) { } }

    const container = new ServiceCollection();
    container.dependenciesAccessor.set('A', {
        lifetime: 'singleton',
        type: A,
        parameters: [{ name: 'b', type: 'B' }]
    });
    container.dependenciesAccessor.set('B', {
        lifetime: 'singleton',
        type: B,
        parameters: [{ name: 'a', type: 'A' }]
    });

    context.assert.throws(() => {
        container.resolve('A');
    }, CircularDependencyException);
});

test('ServiceCollection: resolve() throws UnresolvedDependencyException', (context: TestContext) => {
    class UnresolvedService {
        constructor(_: any) { }
    }

    const container = new ServiceCollection();
    container.dependenciesAccessor.set('X', {
        lifetime: 'singleton',
        type: UnresolvedService,
        parameters: [{ name: 'missing', type: 'MissingService' }]
    });

    context.assert.throws(() => {
        container.resolve('X');
    }, UnresolvedDependencyException);
});

test('ServiceCollection: resolve() uses fallback from globalThis', (context: TestContext) => {
    (globalThis as any).MyPrimitive = class { };
    const container = new ServiceCollection();

    const instance = container.resolve('MyPrimitive');
    context.assert.ok(instance instanceof (globalThis as any).MyPrimitive);

    delete (globalThis as any).MyPrimitive;
});

test('ServiceCollection: onResolve returns instance and avoids constructor', (context: TestContext) => {
    class CustomService { }

    const container = new ServiceCollection();
    let called = false;

    container.dependenciesAccessor.set('Service', {
        lifetime: 'singleton',
        type: CustomService,
        parameters: []
    });

    const mockInstance = { custom: true };
    container.onResolve = (ctx) => {
        called = true;
        if (ctx.name === 'Service') return mockInstance;
        return null;
    };

    const resolved = container.resolve('Service');

    context.assert.strictEqual(resolved, mockInstance);
    context.assert.strictEqual(container.resolve('Service'), mockInstance);
    context.assert.ok(called);
});

test('ServiceCollection: dependenciesAccessor.set() registers service correctly', (context: TestContext) => {
    class Simple { }
    const container = new ServiceCollection();

    container.dependenciesAccessor.set('Simple', {
        lifetime: 'transient',
        type: Simple,
        parameters: [{ name: 'x', type: Number }]
    });

    const resolved = container.resolve('Simple');
    context.assert.ok(resolved instanceof Simple);
});

test('ServiceCollection: addTransient() with no arguments does nothing', (context: TestContext) => {
    const container = new ServiceCollection();
    context.assert.doesNotThrow(() => {
        container.addTransient();
    });
});

test('ServiceCollection: addSingleton() with no arguments does nothing', (context: TestContext) => {
    const container = new ServiceCollection();
    context.assert.doesNotThrow(() => {
        container.addSingleton();
    });
});