/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

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

/**
 * Represents a dictionary data structure.
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
     * @returns An array of values.
     */
    public get values(): TValue[];

    /**
     * Gets all keys in the dictionary.
     * @returns An array of keys.
     */
    public get keys(): TKey[];

    /**
     * Gets the number of items in the dictionary.
     * @returns The count of items.
     */
    public get count(): number;
}

/**
 * Represents a list data structure.
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
     * @returns The count of items.
     */
    public get count(): number;

    /**
     * Converts the list to an array.
     * @returns An array of items in the list.
     */
    public toArray(): T[];
}