/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Stack } from '../src/stack{t}.js';

test('Stack<T>: instance - success', (context: TestContext) => {
    const stack = new Stack<string>();
    context.assert.ok(stack instanceof Stack);
});

test('Stack<T>: push - success', (context: TestContext) => {
    const stack = new Stack<string>();
    stack.push('test');
    context.assert.equal(stack.current, 'test');
});

test('Stack<T>: pop - success', (context: TestContext) => {
    const stack = new Stack<string>();
    stack.push('test');
    context.assert.equal(stack.pop(), 'test');
    context.assert.equal(stack.current, null);
});

test('Stack<T>: pop - empty stack', (context: TestContext) => {
    const stack = new Stack<string>();
    context.assert.equal(stack.pop(), null);
});

test('Stack<T>: current - success', (context: TestContext) => {
    const stack = new Stack<string>();
    stack.push('test');
    context.assert.equal(stack.current, 'test');
});

test('Stack<T>: current - empty stack', (context: TestContext) => {
    const stack = new Stack<string>();
    context.assert.equal(stack.current, null);
});