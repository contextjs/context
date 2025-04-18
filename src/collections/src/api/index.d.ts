/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

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