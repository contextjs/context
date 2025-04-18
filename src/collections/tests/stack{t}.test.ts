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
    context.assert.equal(stack.count, 1);
    context.assert.equal(stack.isEmpty, false);
});

test('Stack<T>: pop - success', (context: TestContext) => {
    const stack = new Stack<string>();
    stack.push('test');
    context.assert.equal(stack.pop(), 'test');
    context.assert.equal(stack.current, null);
    context.assert.equal(stack.count, 0);
    context.assert.equal(stack.isEmpty, true);
});

test('Stack<T>: pop - empty stack', (context: TestContext) => {
    const stack = new Stack<string>();
    context.assert.equal(stack.pop(), null);
});

test('Stack<T>: current - success', (context: TestContext) => {
    const stack = new Stack<string>();
    stack.push('first');
    stack.push('second');
    context.assert.equal(stack.current, 'second');
});

test('Stack<T>: current - empty stack', (context: TestContext) => {
    const stack = new Stack<string>();
    context.assert.equal(stack.current, null);
});

test('Stack<T>: clear - success', (context: TestContext) => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.clear();
    context.assert.equal(stack.count, 0);
    context.assert.equal(stack.current, null);
    context.assert.equal(stack.isEmpty, true);
});

test('Stack<T>: toArray - success', (context: TestContext) => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    context.assert.deepEqual(stack.toArray(), [1, 2, 3]);
});

test('Stack<T>: push and pop multiple - correct order', (context: TestContext) => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    context.assert.equal(stack.pop(), 3);
    context.assert.equal(stack.pop(), 2);
    context.assert.equal(stack.pop(), 1);
    context.assert.equal(stack.pop(), null);
});