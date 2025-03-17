/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ObjectExtensions } from "../../src/extensions/object.extensions.mjs";

test('ObjectExtensions: isNullOrUndefined - success', (context: TestContext) => {
    const value = null;
    context.assert.ok(ObjectExtensions.isNullOrUndefined(value) === true);
});

test('ObjectExtensions: isNullOrUndefined - failure', (context: TestContext) => {
    const value = "a";
    context.assert.ok(ObjectExtensions.isNullOrUndefined(value) === false);
});

test('ObjectExtensions: isNull - success', (context: TestContext) => {
    const value = null;
    context.assert.ok(ObjectExtensions.isNull(value) === true);
});

test('ObjectExtensions: isNull - failure', (context: TestContext) => {
    const value = "a";
    context.assert.ok(ObjectExtensions.isNull(value) === false);
});

test('ObjectExtensions: isUndefined - success', (context: TestContext) => {
    const value = undefined;
    context.assert.ok(ObjectExtensions.isUndefined(value) === true);
});

test('ObjectExtensions: isUndefined - failure', (context: TestContext) => {
    const value = "a";
    context.assert.ok(ObjectExtensions.isUndefined(value) === false);
});