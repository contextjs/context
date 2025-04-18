/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HashSet } from '../src/hash-set{t}.js';

type Item = { id: number };

test('HashSet<T>: instance - default comparer - success', (context: TestContext) => {
    const set = new HashSet<number>();
    context.assert.ok(set instanceof HashSet);
    context.assert.equal(set.count, 0);
    context.assert.equal(set.isEmpty, true);
});

test('HashSet<T>: add - default comparer - primitives', (context: TestContext) => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(1);
    set.add(2);
    context.assert.equal(set.count, 2);
    context.assert.deepEqual(set.toArray(), [1, 2]);
});

test('HashSet<T>: has - default comparer - reference equality', (context: TestContext) => {
    const set = new HashSet<object>();
    const obj = { x: 1 };
    set.add(obj);
    context.assert.equal(set.has(obj), true);
    context.assert.equal(set.has({ x: 1 }), false);
});

test('HashSet<T>: remove - default comparer - primitives', (context: TestContext) => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.remove(1);
    context.assert.equal(set.count, 1);
    context.assert.equal(set.has(1), false);
});

test('HashSet<T>: clear - default comparer', (context: TestContext) => {
    const set = new HashSet<number>();
    set.add(1);
    set.add(2);
    set.clear();
    context.assert.equal(set.count, 0);
    context.assert.equal(set.isEmpty, true);
});

test('HashSet<T>: custom comparer - value equality', (context: TestContext) => {
    const set = new HashSet<Item>((a, b) => a.id === b.id);
    set.add({ id: 1 });
    set.add({ id: 1 });
    set.add({ id: 2 });

    context.assert.equal(set.count, 2);
    context.assert.equal(set.has({ id: 1 }), true);
    context.assert.equal(set.has({ id: 3 }), false);
});

test('HashSet<T>: custom comparer - remove by value', (context: TestContext) => {
    const set = new HashSet<Item>((a, b) => a.id === b.id);
    set.add({ id: 1 });
    set.add({ id: 2 });
    set.remove({ id: 1 });

    context.assert.equal(set.count, 1);
    context.assert.equal(set.has({ id: 1 }), false);
});

test('HashSet<T>: toArray - custom comparer', (context: TestContext) => {
    const a = { id: 1 };
    const b = { id: 2 };
    const set = new HashSet<Item>((x, y) => x.id === y.id);
    set.add(a);
    set.add(b);
    context.assert.deepEqual(set.toArray(), [a, b]);
});