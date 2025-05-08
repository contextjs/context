/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { HeaderCollection } from '../../src/models/header.collection.js';

test('HeaderCollection: set, get, and has are case-insensitive', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('Content-Type', 'text/html');
    context.assert.strictEqual(headers.get('content-type'), 'text/html');
    context.assert.strictEqual(headers.get('CONTENT-TYPE'), 'text/html');
    context.assert.ok(headers.has('CoNtEnT-TyPe'));
    context.assert.ok(!headers.has('missing-header'));
});

test('HeaderCollection: entries yields original names and values in insertion order', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('Foo-Bar', 'baz');
    headers.set('X-Test', '123');
    const entries = Array.from(headers.entries());
    context.assert.deepStrictEqual(entries, [
        ['Foo-Bar', 'baz'],
        ['X-Test', '123'],
    ]);
});

test('HeaderCollection: originalEntries yields lowercase keys and values', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('AbC', 'value1');
    headers.set('XyZ', 'value2');
    const original = Array.from(headers.originalEntries());
    context.assert.deepStrictEqual(original, [
        ['abc', 'value1'],
        ['xyz', 'value2'],
    ]);
});

test('HeaderCollection: keys iterator returns original header names', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('One', '1');
    headers.set('Two', '2');
    const keys = Array.from(headers.keys());
    context.assert.deepStrictEqual(keys, ['One', 'Two']);
});

test('HeaderCollection: values iterator returns objects with originalName and value', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('A', 'alpha');
    headers.set('B', 'beta');
    const vals = Array.from(headers.values());
    context.assert.deepStrictEqual(vals, [
        { originalName: 'A', value: 'alpha' },
        { originalName: 'B', value: 'beta' },
    ]);
});

test('HeaderCollection: default iterator is entries()', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('X', 'xval');
    headers.set('Y', 'yval');
    const viaIterator = Array.from(headers);
    const viaEntries = Array.from(headers.entries());
    context.assert.deepStrictEqual(viaIterator, viaEntries);
});

test('HeaderCollection: clear removes all headers', (context: TestContext) => {
    const headers = new HeaderCollection();
    headers.set('Z', 'zval');
    context.assert.ok(headers.has('Z'));
    headers.clear();
    context.assert.ok(!headers.has('Z'));
    context.assert.deepStrictEqual(Array.from(headers.entries()), []);
});