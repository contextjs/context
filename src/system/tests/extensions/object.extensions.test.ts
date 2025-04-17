/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ObjectExtensions } from '../../src/extensions/object.extensions.ts';

test('ObjectExtensions: isNull - success', (context: TestContext) => {
    const value: null = null;
    context.assert.strictEqual(ObjectExtensions.isNull(value), true);
});

test('ObjectExtensions: isNull - failure', (context: TestContext) => {
    const value = 'abc';
    context.assert.strictEqual(ObjectExtensions.isNull(value), false);
});

test('ObjectExtensions: isUndefined - success', (context: TestContext) => {
    const value: undefined = undefined;
    context.assert.strictEqual(ObjectExtensions.isUndefined(value), true);
});

test('ObjectExtensions: isUndefined - failure', (context: TestContext) => {
    const value = 42;
    context.assert.strictEqual(ObjectExtensions.isUndefined(value), false);
});

test('ObjectExtensions: isNullOrUndefined - success', (context: TestContext) => {
    const nullValue: null = null;
    const undefinedValue: undefined = undefined;

    context.assert.strictEqual(ObjectExtensions.isNullOrUndefined(nullValue), true);
    context.assert.strictEqual(ObjectExtensions.isNullOrUndefined(undefinedValue), true);
});

test('ObjectExtensions: isNullOrUndefined - failure', (context: TestContext) => {
    const value = 'hello';
    context.assert.strictEqual(ObjectExtensions.isNullOrUndefined(value), false);
});

test('ObjectExtensions: type narrowing - isNullOrUndefined', (context: TestContext) => {
    const maybeString: string | null | undefined = 'contextjs';

    if (!ObjectExtensions.isNullOrUndefined(maybeString)) {
        const upper = maybeString.toUpperCase();
        context.assert.strictEqual(upper, 'CONTEXTJS');
    }
    else
        context.assert.ok(true);
});