/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { PathNotFoundException } from '../../src/exceptions/path-not-found.exception.ts';

test('PathNotFoundException: instance - success', (context: TestContext) => {
    const exception = new PathNotFoundException("/invalid/path");
    context.assert.ok(exception instanceof PathNotFoundException);
});

test('PathNotFoundException: message - success', (context: TestContext) => {
    const exception = new PathNotFoundException("/invalid/path");
    context.assert.strictEqual(exception.message, "The specified path was not found: /invalid/path");
});

test('PathNotFoundException: name - success', (context: TestContext) => {
    const exception = new PathNotFoundException("/invalid/path");
    context.assert.strictEqual(exception.name, "PathNotFoundException");
});

test('PathNotFoundException: toString - success', (context: TestContext) => {
    const exception = new PathNotFoundException("/invalid/path");
    context.assert.strictEqual(exception.toString(), "PathNotFoundException: The specified path was not found: /invalid/path");
});