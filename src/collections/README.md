# @contextjs/collections

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/collections?cache=300)](https://www.npmjs.com/package/@contextjs/collections)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Contains interfaces and classes that define various collections of objects, such as lists, stacks and dictionaries.

### Installation

```
npm i @contextjs/collections
```

### Classes

```typescript
/**
 * Represents a stack data structure.
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
     * @returns The popped element or null if the stack is empty.
     */
    public pop(): T | null;

    /**
     * Gets the current element on the stack without removing it.
     * 
     * @returns The current element or null if the stack is empty.
     */
    public get current(): T | null;
}
```