/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export declare class Dictionary<TKey, TValue> {
    /**
     * Adds or updates a key-value pair in the dictionary.
     * @param key The key to set.
     * @param value The value associated with the key.
     */
    set(key: TKey, value: TValue): void;

    /**
     * Retrieves the value associated with the specified key.
     * Returns `null` if the key is not present.
     * @param key The key to retrieve.
     */
    get(key: TKey): TValue | null;

    /**
     * Determines whether the dictionary contains the specified key.
     * @param key The key to check.
     */
    has(key: TKey): boolean;

    /**
     * Removes the value associated with the specified key, if present.
     * @param key The key to remove.
     */
    delete(key: TKey): void;

    /**
     * Removes all entries from the dictionary.
     */
    clear(): void;

    /**
     * Returns an array of all values in the dictionary.
     */
    values(): TValue[];

    /**
     * Returns an array of all keys in the dictionary.
     */
    keys(): TKey[];

    /**
     * Gets the total number of entries in the dictionary.
     */
    count(): number;
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

/**
 * Represents a binary search class for sorted arrays.
 * @template T The type of elements in the array.
 * This class provides a static method to perform binary search.
 * It can use a custom comparison function or the default comparison.
 * If a custom comparison function is not provided,
 * it uses the default comparison based on the `<` and `>` operators.
 */
export declare class BinarySearch {
    /**
     * Performs a binary search on a sorted array.
     * @template T The type of elements in the array.
     * @param items The sorted array to search.
     * @param target The item to search for.
     * @param compare Optional comparison function. If not provided, uses default comparison.
     * @returns The index of the target item, or -1 if not found.
     */
    public static search<T>(items: T[], target: T, compare?: (a: T, b: T) => number): number;
    /**
     * Performs a binary search on a sorted array with a numeric target.
     * @template T The type of elements in the array.
     * @param items The sorted array to search.
     * @param target The numeric value to search for.
     * @param compare Comparison function that compares an item with a number.
     * @returns The index of the target item, or -1 if not found.
     */
    public static search<T>(items: T[], target: number, compare?: (a: T, b: number) => number): number;
}