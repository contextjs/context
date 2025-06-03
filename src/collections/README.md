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

## Installation

```bash
npm i @contextjs/collections
```

## Quick Start

Jump to: [API Reference](#api-reference) • [Design Notes](#design-notes) • [Testing](#testing)

### Examples:
This guide shows basic usage of all collection types in the `@contextjs/collections` package.

## Dictionary<TKey, TValue>

```ts
import { Dictionary } from '@contextjs/collections';

const dictionary = new Dictionary<string, number>();

dictionary.set("apple", 1);
dictionary.set("banana", 2);

console.log(dictionary.get("apple"));    // 1
console.log(dictionary.has("banana"));   // true
console.log(dictionary.has("cherry"));   // false

dictionary.delete("banana");
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
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/collections#api-reference).

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