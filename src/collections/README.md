# @contextjs/collections

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/collections?cache=300)](https://www.npmjs.com/package/@contextjs/collections)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> A set of object-oriented collection types for TypeScript, designed for clarity, safety, and predictability in modern applications.

## Features

- Fully type-safe generic collections
- Well-known data structures designed with a consistent and type-safe API (`List`, `Dictionary`, `Queue`, `Stack`, `HashSet`)
- Consistent `null` handling for empty or missing values
- Clean and minimal runtime behavior
- Optional value equality comparison in `HashSet<T>`
- Zero external dependencies, tested and production-ready

---

## Installation

```bash
npm i @contextjs/collections
```

---

## Quick Start

Jump to: [API Reference](#api-reference) • [Design Notes](#design-notes) • [Testing](#testing)

### Examples:
This guide shows basic usage of all collection types in the `@contextjs/collections` package.

## Dictionary<TKey, TValue>

```ts
import { Dictionary } from '@contextjs/collections';

const dictionary = new Dictionary<string, number>();

dictionary.add("apple", 1);
dictionary.add("banana", 2);

console.log(dictionary.get("apple"));    // 1
console.log(dictionary.has("banana"));   // true
console.log(dictionary.has("cherry"));   // false

dictionary.remove("banana");
console.log(dictionary.count);           // 1

dictionary.clear();
console.log(dictionary.count);           // 0
```

## HashSet<T>

```ts
import { HashSet } from '@contextjs/collections';

type User = { id: number };

const users = new HashSet<User>((a, b) => a.id === b.id);

users.add({ id: 1 });
users.add({ id: 2 });
users.add({ id: 1 }); // Duplicate by id, ignored

console.log(users.count);                // 2
console.log(users.has({ id: 1 }));       // true (based on comparer)
console.log(users.has({ id: 3 }));       // false

users.remove({ id: 1 });
console.log(users.count);                // 1
```

```ts
// Also works with primitives using default equality
const ids = new HashSet<number>();
ids.add(1);
ids.add(1);
console.log(ids.count); // 1
```

## List<T>

```ts
import { List } from '@contextjs/collections';

const list = new List<string>();

list.add("alpha");
list.add("beta");
list.add("gamma");

console.log(list.get(1));     // "beta"
console.log(list.count);      // 3

list.remove(0);               // removes "alpha"
console.log(list.get(0));     // "beta"

list.clear();
console.log(list.count);      // 0
```

## Queue<T>

```ts
import { Queue } from '@contextjs/collections';

const queue = new Queue<string>();

queue.enqueue("first");
queue.enqueue("second");

console.log(queue.peek);      // "first"
console.log(queue.dequeue()); // "first"
console.log(queue.dequeue()); // "second"
console.log(queue.dequeue()); // null (empty)

queue.enqueue("third");
console.log(queue.count);     // 1

queue.clear();
console.log(queue.isEmpty);   // true
```

## Stack<T>

```ts
import { Stack } from '@contextjs/collections';

const stack = new Stack<number>();

stack.push(10);
stack.push(20);

console.log(stack.current);   // 20
console.log(stack.pop());     // 20
console.log(stack.pop());     // 10
console.log(stack.pop());     // null (empty)

stack.push(30);
console.log(stack.count);     // 1

stack.clear();
console.log(stack.isEmpty);   // true
```

## API Reference

```ts
/**
 * Represents a dictionary (key-value map) data structure.
 * @template TKey The type of keys in the dictionary.
 * @template TValue The type of values in the dictionary.
 */
export declare class Dictionary<TKey, TValue> {
    /**
     * Adds an item to the dictionary.
     * @param key The key of the item.
     * @param item The item to add. 
     */
    public add(key: TKey, item: TValue): void;

    /**
     * Gets an item from the dictionary.
     * @param key The key of the item.
     * @returns The item or null if not found.
     */
    public get(key: TKey): TValue | null;

    /**
     * Checks if the dictionary contains a key.
     * @param key The key to check.
     * @returns True if the key exists, otherwise false.
     */
    public has(key: TKey): boolean;

    /**
     * Removes an item from the dictionary.
     * @param key The key of the item to remove.
     */
    public remove(key: TKey): void;

    /**
     * Clears all items from the dictionary.
     */
    public clear(): void;

    /**
     * Gets all values in the dictionary.
     */
    public get values(): TValue[];

    /**
     * Gets all keys in the dictionary.
     */
    public get keys(): TKey[];

    /**
     * Gets the number of items in the dictionary.
     */
    public get count(): number;
}

/**
 * Represents a hash set (unique values) using custom equality comparison.
 * @template T The type of elements in the set.
 */
export declare class HashSet<T> {
    /**
     * Creates a new hash set.
     * @param equals Optional equality comparer. Defaults to strict equality (===).
     */
    constructor(equals?: (a: T, b: T) => boolean);

    /**
     * Adds an item to the set if it doesn't already exist.
     * @param item The item to add.
     */
    public add(item: T): void;

    /**
     * Removes an item from the set.
     * @param item The item to remove.
     */
    public remove(item: T): void;

    /**
     * Checks whether the set contains an item.
     * @param item The item to check.
     * @returns True if the item exists, otherwise false.
     */
    public has(item: T): boolean;

    /**
     * Clears all items from the set.
     */
    public clear(): void;

    /**
     * Gets the number of items in the set.
     */
    public get count(): number;

    /**
     * Indicates whether the set is empty.
     */
    public get isEmpty(): boolean;

    /**
     * Converts the set to an array.
     * @returns An array of set elements.
     */
    public toArray(): T[];
}

/**
 * Represents a list (dynamic array) data structure.
 * @template T The type of elements in the list.
 */
export declare class List<T> {
    /**
     * Adds an item to the list.
     * @param item The item to add.
     */
    public add(item: T): void;

    /**
     * Removes an item from the list by index.
     * @param index The index of the item to remove.
     */
    public remove(index: number): void;

    /**
     * Gets an item from the list by index.
     * @param index The index of the item to get.
     * @returns The item or null if not found.
     */
    public get(index: number): T | null;

    /**
     * Clears all items from the list.
     */
    public clear(): void;

    /**
     * Gets the number of items in the list.
     */
    public get count(): number;

    /**
     * Converts the list to an array.
     * @returns An array of items in the list.
     */
    public toArray(): T[];
}

/**
 * Represents a queue (FIFO) data structure.
 * @template T The type of elements in the queue.
 */
export declare class Queue<T> {
    /**
     * Enqueues an item into the queue.
     * @param item The item to add.
     */
    public enqueue(item: T): void;

    /**
     * Dequeues and returns the first item from the queue.
     * @returns The dequeued item, or null if the queue is empty.
     */
    public dequeue(): T | null;

    /**
     * Gets the item at the front of the queue without removing it.
     */
    public get peek(): T | null;

    /**
     * Clears all items from the queue.
     */
    public clear(): void;

    /**
     * Gets the number of items in the queue.
     */
    public get count(): number;

    /**
     * Indicates whether the queue is empty.
     */
    public get isEmpty(): boolean;

    /**
     * Converts the queue to an array.
     * @returns An array of queue items in insertion order.
     */
    public toArray(): T[];
}

/**
 * Represents a stack (LIFO) data structure.
 * @template T The type of elements in the stack.
 */
export declare class Stack<T> {
    /**
     * Pushes an element onto the stack.
     * @param item The item to push.
     */
    public push(item: T): void;

    /**
     * Pops an element off the stack.
     * @returns The popped element, or null if the stack is empty.
     */
    public pop(): T | null;

    /**
     * Gets the current element on the stack without removing it.
     * @returns The current element, or null if the stack is empty.
     */
    public get current(): T | null;

    /**
     * Clears all elements from the stack.
     */
    public clear(): void;

    /**
     * Gets the number of elements in the stack.
     */
    public get count(): number;

    /**
     * Indicates whether the stack is empty.
     */
    public get isEmpty(): boolean;

    /**
     * Converts the stack to an array.
     * @returns An array of stack elements in insertion order.
     */
    public toArray(): T[];
}
```

## Design Notes

These collections are written in TypeScript-first style with predictable, runtime-safe behavior:

- `null` is returned instead of throwing when an item is missing.
- `HashSet<T>` supports structural equality with a custom comparer function.
- Internals are designed to be lightweight, avoiding unnecessary abstraction.

## Testing

This package maintains full test coverage for:
- All public collection methods
- Edge behavior on underflow, removal, or clear
- Equality comparison logic
- Type safety and mutation guarantees