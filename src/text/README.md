# @contextjs/text

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/text?cache=300)](https://www.npmjs.com/package/@contextjs/text)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> String manipulation utilities for ContextJS applications

## ✨ Features

- Chainable, immutable-safe `StringBuilder` implementation
- Efficient string concatenation using segment arrays
- Support for insertion, removal, and replacement
- Fluent `appendFormat`, `appendLine`, `clear`, and `clone` methods
- Implicit string conversion with `Symbol.toPrimitive`
- Test-driven and zero-runtime dependency

## 📦 Installation

```bash
npm i @contextjs/text
```

## 🚀 Usage Example

```ts
import { StringBuilder } from "@contextjs/text";

const builder = new StringBuilder();

builder.append("Hello").append(", ").appendFormat("{0}!", "world");
console.log(builder.toString()); // "Hello, world!"
```

## 🧩 API Reference

### `StringBuilder`

```ts
export declare class StringBuilder {
    /**
     * Appends the given string to the builder.
     *
     * @param value The string to append.
     * @returns The current instance for chaining.
     */
    append(value: string): this;

    /**
     * Appends the given string followed by a newline.
     *
     * @param text The string to append before the newline. Defaults to an empty string.
     * @returns The current instance for chaining.
     */
    appendLine(text?: string): this;

    /**
     * Appends a formatted string where placeholders {0}, {1}, ... are replaced by args.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     * @throws {ArgumentNullException} If the format string is null, empty, or whitespace.
     */
    appendFormat(format: string, ...args: any[]): this;

    /**
     * Inserts the given value at the specified segment index.
     *
     * @param index The position at which to insert the value.
     * @param value The string to insert.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    insert(index: number, value: string): this;

    /**
     * Removes a number of segments starting at the specified index.
     *
     * @param index The starting index of the segment to remove.
     * @param count The number of segments to remove.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    removeSegment(index: number, count?: number): this;

    /**
     * Replaces the segment at the specified index with a new value.
     *
     * @param index The index of the segment to replace.
     * @param value The new string to replace the segment with.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    replaceSegment(index: number, value: string): this;

    /**
     * Clears all content from the builder.
     */
    clear(): void;

    /**
     * Converts the builder to a single string.
     *
     * @returns The concatenated string.
     */
    toString(): string;

    /**
     * Returns a copy of the internal segment array.
     *
     * @returns An array of all segments.
     */
    toArray(): string[];

    /**
     * Creates a clone of the current StringBuilder instance.
     * The internal segments are copied to ensure isolated mutation.
     *
     * @returns A new StringBuilder with the same content.
     */
    clone(): StringBuilder;

    /**
     * Total number of characters in the builder.
     */
    readonly length: number;

    /**
     * Number of segments appended.
     */
    readonly segmentCount: number;

    /**
     * Indicates whether the builder is empty.
     */
    readonly isEmpty: boolean;

    /**
     * Allows implicit conversion to string (e.g., `${builder}`).
     *
     * @param hint The type hint provided by the JavaScript engine.
     * @returns The string representation of the builder.
     */
    [Symbol.toPrimitive](hint: string): string;
}
```

