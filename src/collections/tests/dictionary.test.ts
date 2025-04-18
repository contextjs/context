/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Dictionary } from '../src/dictionary.js';

test('Dictionary<TKey, TValue>: instance - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    context.assert.ok(dictionary instanceof Dictionary);
});

test('Dictionary<TKey, TValue>: add - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    context.assert.equal(dictionary.get(1), 'one');
});

test('Dictionary<TKey, TValue>: add - overwrite', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.add(1, 'uno');
    context.assert.equal(dictionary.get(1), 'uno');
});

test('Dictionary<TKey, TValue>: get - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    context.assert.equal(dictionary.get(1), 'one');
});

test('Dictionary<TKey, TValue>: get - null', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    context.assert.equal(dictionary.get(1), null);
});

test('Dictionary<TKey, TValue>: remove - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.remove(1);
    context.assert.equal(dictionary.get(1), null);
});

test('Dictionary<TKey, TValue>: remove - not found', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.remove(2);
    context.assert.equal(dictionary.get(1), 'one');
});

test('Dictionary<TKey, TValue>: clear - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.clear();
    context.assert.equal(dictionary.get(1), null);
});

test('Dictionary<TKey, TValue>: values - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.add(2, 'two');
    context.assert.deepEqual(dictionary.values, ['one', 'two']);
});

test('Dictionary<TKey, TValue>: keys - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.add(2, 'two');
    context.assert.deepEqual(dictionary.keys, [1, 2]);
});

test('Dictionary<TKey, TValue>: count - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.add(2, 'two');
    context.assert.equal(dictionary.count, 2);
});

test('Dictionary<TKey, TValue>: count - empty', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    context.assert.equal(dictionary.count, 0);
});

test('Dictionary<TKey, TValue>: add - null key', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(null as unknown as number, 'one');
    context.assert.equal(dictionary.get(null as unknown as number), 'one');
});

test('Dictionary<TKey, TValue>: has - success', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    context.assert.equal(dictionary.has(1), true);
    context.assert.equal(dictionary.has(2), false);
});

test('Dictionary<TKey, TValue>: object keys - success', (context: TestContext) => {
    const key = { id: 1 };
    const dictionary = new Dictionary<object, string>();
    dictionary.add(key, 'value');
    context.assert.equal(dictionary.get(key), 'value');
    context.assert.equal(dictionary.has(key), true);
    context.assert.equal(dictionary.has({ id: 1 }), false);
});

test('Dictionary<TKey, TValue>: clear - multiple items', (context: TestContext) => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, 'one');
    dictionary.add(2, 'two');
    dictionary.clear();
    context.assert.equal(dictionary.count, 0);
    context.assert.equal(dictionary.get(1), null);
    context.assert.equal(dictionary.get(2), null);
});