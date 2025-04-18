/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { List } from '../src/list{t}.js';

test('List<T>: instance - success', (context: TestContext) => {
    const list = new List<number>();
    context.assert.strictEqual(list.count, 0);
});

test('List<T>: add - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.strictEqual(list.count, 2);
});

test('List<T>: remove - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.remove(0);
    context.assert.strictEqual(list.count, 1);
});

test('List<T>: remove - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.remove(0);
    context.assert.notStrictEqual(list.count, 2);
});

test('List<T>: get - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.strictEqual(list.get(0), 1);
});

test('List<T>: get - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.notStrictEqual(list.get(0), 2);
});

test('List<T>: clear - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.clear();
    context.assert.strictEqual(list.count, 0);
});

test('List<T>: clear - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.clear();
    context.assert.notStrictEqual(list.count, 2);
});

test('List<T>: toArray - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.deepEqual(list.toArray(), [1, 2]);
});

test('List<T>: get - negative index returns null', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    context.assert.strictEqual(list.get(-1), null);
});

test('List<T>: get - out of range index returns null', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    context.assert.strictEqual(list.get(10), null);
});

test('List<T>: remove - index from empty list', (context: TestContext) => {
    const list = new List<number>();
    list.remove(0);
    context.assert.strictEqual(list.count, 0);
});

test('List<T>: remove - out of range index', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.remove(5);
    context.assert.strictEqual(list.count, 1);
});

test('List<T>: add - triggers internal capacity resize', (context: TestContext) => {
    const list = new List<number>();
    for (let i = 0; i < 100; i++)
        list.add(i);

    context.assert.strictEqual(list.count, 100);
    context.assert.strictEqual(list.get(99), 99);
});
