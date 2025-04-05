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
    context.assert.strictEqual(list.count, 0, 'List<T> should be empty on creation');
});

test('List<T>: add - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.strictEqual(list.count, 2, 'List<T> should have 2 items after adding 2 items');
});

test('List<T>: remove - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.remove(0);
    context.assert.strictEqual(list.count, 1, 'List<T> should have 1 item after removing 1 item');
});

test('List<T>: remove - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.remove(0);
    context.assert.notStrictEqual(list.count, 2, 'List<T> should not have 2 items after removing 1 item');
});

test('List<T>: get - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.strictEqual(list.get(0), 1, 'List<T> should return the first item when getting index 0');
});

test('List<T>: get - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.notStrictEqual(list.get(0), 2, 'List<T> should not return the second item when getting index 0');
});

test('List<T>: clear - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.clear();
    context.assert.strictEqual(list.count, 0, 'List<T> should be empty after clearing');
});

test('List<T>: clear - failure', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    list.clear();
    context.assert.notStrictEqual(list.count, 2, 'List<T> should not have 2 items after clearing');
});

test('List<T>: toArray - success', (context: TestContext) => {
    const list = new List<number>();
    list.add(1);
    list.add(2);
    context.assert.deepEqual(list.toArray(), [1, 2], 'List<T> should return the correct array representation');
});

