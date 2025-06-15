/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { BinarySearch } from "../src/binary-search.js";

test("BinarySearch: search for number in sorted array (without compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 3;
    const index = BinarySearch.search(numbers, target);

    context.assert.strictEqual(index, 2);
});

test("BinarySearch: search for number in sorted array (with compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 3;
    const index = BinarySearch.search(numbers, target, (a, b) => a - b);

    context.assert.strictEqual(index, 2);
});

test("BinarySearch: search for string in sorted array (without compare)", (context: TestContext) => {
    const words = ['apple', 'banana', 'cherry'];
    const target = 'banana';
    const index = BinarySearch.search(words, target);

    context.assert.strictEqual(index, 1);
});

test("BinarySearch: search for string in sorted array (with compare)", (context: TestContext) => {
    const words = ['apple', 'banana', 'cherry'];
    const target = 'banana';
    const index = BinarySearch.search(words, target, (a, b) => a.localeCompare(b));

    context.assert.strictEqual(index, 1);
});

test("BinarySearch: search for object in sorted array with custom compare (without compare)", (context: TestContext) => {
    const items = [
        { id: 1, value: 'apple' },
        { id: 2, value: 'banana' },
        { id: 3, value: 'cherry' }
    ];

    const target = 2;

    context.assert.throws(() => BinarySearch.search(items, target), {
        message: "Unsupported default comparison type. Use a custom compare function."
    });
});

test("BinarySearch: search for object in sorted array with custom compare (with compare)", (context: TestContext) => {
    const items = [
        { id: 1, value: 'apple' },
        { id: 2, value: 'banana' },
        { id: 3, value: 'cherry' }
    ];

    const target = 2;
    const index = BinarySearch.search(items, target, (item, targetId) => item.id - targetId);

    context.assert.strictEqual(index, 1);
});

test("BinarySearch: search for element not found (without compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 6;
    const index = BinarySearch.search(numbers, target);

    context.assert.strictEqual(index, -1);
});

test("BinarySearch: search for element not found (with compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 6;
    const index = BinarySearch.search(numbers, target, (a, b) => a - b);

    context.assert.strictEqual(index, -1);
});

test("BinarySearch: search for element at the beginning of the array (without compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 1;
    const index = BinarySearch.search(numbers, target);

    context.assert.strictEqual(index, 0);
});

test("BinarySearch: search for element at the beginning of the array (with compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 1;
    const index = BinarySearch.search(numbers, target, (a, b) => a - b);

    context.assert.strictEqual(index, 0);
});

test("BinarySearch: search for element at the end of the array (without compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 5;
    const index = BinarySearch.search(numbers, target);

    context.assert.strictEqual(index, 4);
});

test("BinarySearch: search for element at the end of the array (with compare)", (context: TestContext) => {
    const numbers = [1, 2, 3, 4, 5];
    const target = 5;
    const index = BinarySearch.search(numbers, target, (a, b) => a - b);

    context.assert.strictEqual(index, 4);
});

test("BinarySearch: search in empty array (without compare)", (context: TestContext) => {
    const numbers: number[] = [];
    const target = 3;
    const index = BinarySearch.search(numbers, target);

    context.assert.strictEqual(index, -1);
});

test("BinarySearch: search in empty array (with compare)", (context: TestContext) => {
    const numbers: number[] = [];
    const target = 3;
    const index = BinarySearch.search(numbers, target, (a, b) => a - b);

    context.assert.strictEqual(index, -1);
});