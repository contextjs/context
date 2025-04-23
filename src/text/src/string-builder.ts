/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ArgumentOutOfRangeException, StringExtensions, Throw } from "@contextjs/system";

export class StringBuilder {
    private _segments: string[] = [];
    private _length: number = 0;

    /**
     * Appends the given string to the builder.
     *
     * @param value The string to append.
     * @returns The current instance for chaining.
     */
    public append(value: string): this {
        this._segments.push(value);
        this._length += value.length;

        return this;
    }

    /**
     * Appends the given string followed by a newline.
     *
     * @param text The string to append before the newline. Defaults to an empty string.
     * @returns The current instance for chaining.
     */
    public appendLine(text: string = StringExtensions.empty): this {
        this._segments.push(text, StringExtensions.newLine);
        this._length += text.length + StringExtensions.newLine.length;

        return this;
    }

    /**
     * Appends a formatted string where placeholders {0}, {1}, ... are replaced by args.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     */
    public appendFormat(format: string, ...args: any[]): this {
        Throw.ifNullOrWhiteSpace(format);

        const formatted = StringExtensions.format(format, ...args);
        this._segments.push(formatted);
        this._length += formatted.length;

        return this;
    }

    /**
     * Inserts the given value at the specified segment index.
     *
     * @param index The position at which to insert the value.
     * @param value The string to insert.
     * @returns The current instance for chaining.
     */
    public insert(index: number, value: string): this {
        if (index < 0 || index > this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        this._segments.splice(index, 0, value);
        this._length += value.length;
        return this;
    }

    /**
     * Removes a number of segments starting at the specified index.
     *
     * @param index The starting index of the segment to remove.
     * @param count The number of segments to remove.
     * @returns The current instance for chaining.
     */
    public removeSegment(index: number, count: number = 1): this {
        if (index < 0 || index >= this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        const removed = this._segments.splice(index, count);
        removed.forEach(seg => this._length -= seg.length);
        return this;
    }

    /**
     * Replaces the segment at the specified index with a new value.
     *
     * @param index The index of the segment to replace.
     * @param value The new string to replace the segment with.
     * @returns The current instance for chaining.
     */
    public replaceSegment(index: number, value: string): this {
        if (index < 0 || index >= this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        const old = this._segments[index];
        this._segments[index] = value;
        this._length += value.length - old.length;
        return this;
    }

    /**
     * Clears all content from the builder.
     */
    public clear(): void {
        this._segments.length = 0;
        this._length = 0;
    }

    /**
     * Converts the builder to a single string.
     *
     * @returns The concatenated string.
     */
    public toString(): string {
        return this._segments.join(StringExtensions.empty);
    }

    /**
     * Returns a copy of the internal segment array.
     *
     * @returns An array of all segments.
     */
    public toArray(): string[] {
        return [...this._segments];
    }

    /**
     * Creates a clone of the current StringBuilder instance.
     * The internal segments are copied to ensure isolated mutation.
     *
     * @returns A new StringBuilder with the same content.
     */
    public clone(): StringBuilder {
        const builder = new StringBuilder();
        builder._segments = [...this._segments];
        builder._length = this._length;
        return builder;
    }

    /**
     * Total number of characters in the builder.
     */
    public get length(): number {
        return this._length;
    }

    /**
     * Number of segments appended.
     */
    public get segmentCount(): number {
        return this._segments.length;
    }

    /**
     * Indicates whether the builder is empty.
     */
    public get isEmpty(): boolean {
        return this._length === 0;
    }

    /**
     * Allows implicit conversion to string (e.g., `${builder}`).
     *
     * @param _hint The type hint provided by the JavaScript engine.
     * @returns The string representation of the builder.
     */
    public [Symbol.toPrimitive](_hint: string): string {
        return this.toString();
    }
}