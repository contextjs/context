/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Queue } from '../src/queue{t}.js';

test('Queue<T>: instance - success', (context: TestContext) => {
    const queue = new Queue<number>();
    context.assert.ok(queue instanceof Queue);
    context.assert.equal(queue.count, 0);
    context.assert.equal(queue.isEmpty, true);
});

test('Queue<T>: enqueue - success', (context: TestContext) => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    context.assert.equal(queue.count, 2);
    context.assert.equal(queue.isEmpty, false);
    context.assert.equal(queue.peek, 1);
});

test('Queue<T>: dequeue - success', (context: TestContext) => {
    const queue = new Queue<string>();
    queue.enqueue('a');
    queue.enqueue('b');
    context.assert.equal(queue.dequeue(), 'a');
    context.assert.equal(queue.count, 1);
    context.assert.equal(queue.peek, 'b');
});

test('Queue<T>: dequeue - empty queue', (context: TestContext) => {
    const queue = new Queue<number>();
    context.assert.equal(queue.dequeue(), null);
    context.assert.equal(queue.peek, null);
    context.assert.equal(queue.count, 0);
    context.assert.equal(queue.isEmpty, true);
});

test('Queue<T>: peek - does not remove', (context: TestContext) => {
    const queue = new Queue<number>();
    queue.enqueue(42);
    context.assert.equal(queue.peek, 42);
    context.assert.equal(queue.count, 1);
});

test('Queue<T>: clear - success', (context: TestContext) => {
    const queue = new Queue<string>();
    queue.enqueue('x');
    queue.enqueue('y');
    queue.clear();
    context.assert.equal(queue.count, 0);
    context.assert.equal(queue.isEmpty, true);
    context.assert.equal(queue.peek, null);
});

test('Queue<T>: toArray - success', (context: TestContext) => {
    const queue = new Queue<number>();
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    context.assert.deepEqual(queue.toArray(), [10, 20, 30]);
});

test('Queue<T>: enqueue and dequeue multiple - correct order', (context: TestContext) => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    context.assert.equal(queue.dequeue(), 1);
    context.assert.equal(queue.dequeue(), 2);
    context.assert.equal(queue.dequeue(), 3);
    context.assert.equal(queue.dequeue(), null);
});