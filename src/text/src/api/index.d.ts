/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

export declare class StringBuilder {
    /**
     * Appends the given string to the builder.
     *
     * @param value The string to append.
     * @returns The current instance for chaining.
     */
    public append(value: string): this;

    /**
     * Appends the given string after escaping it for safe HTML output.
     *
     * @param value The string to append, which will be escaped.
     * @returns The current instance for chaining.
     */
    public appendEscaped(value: string): this

    /**
     * Appends the given string followed by a newline.
     *
     * @param value The string to append before the newline. Defaults to an empty string.
     * @returns The current instance for chaining.
     */
    public appendLine(value?: string): this;

    /**
     * Appends the given string after escaping it for safe HTML output, followed by a newline.
     *
     * @param value The string to append, which will be escaped.
     * @returns The current instance for chaining.
     */
    public appendLineEscaped(value?: string): this;

    /**
     * Appends a formatted string where placeholders {0}, {1}, ... are replaced by args.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     * @throws {ArgumentNullException} If the format string is null, empty, or whitespace.
     */
    public appendFormat(format: string, ...args: any[]): this;

    /**
     * Appends an escaped formatted string after escaping it for safe HTML output.
     * Placeholders {0}, {1}, ... are replaced by args.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     */
    public appendFormatEscaped(format: string, ...args: any[]): this

    /**
     * Inserts the given value at the specified segment index.
     *
     * @param index The position at which to insert the value.
     * @param value The string to insert.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    public insert(index: number, value: string): this;

    /**
     * Removes a number of segments starting at the specified index.
     *
     * @param index The starting index of the segment to remove.
     * @param count The number of segments to remove.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    public removeSegment(index: number, count?: number): this;

    /**
     * Replaces the segment at the specified index with a new value.
     *
     * @param index The index of the segment to replace.
     * @param value The new string to replace the segment with.
     * @returns The current instance for chaining.
     * @throws {ArgumentOutOfRangeException} If the index is out of range.
     */
    public replaceSegment(index: number, value: string): this;

    /**
     * Clears all content from the builder.
     */
    public clear(): void;

    /**
     * Converts the builder to a single string.
     *
     * @returns The concatenated string.
     */
    public toString(): string;

    /**
     * Returns a copy of the internal segment array.
     *
     * @returns An array of all segments.
     */
    public toArray(): string[];

    /**
     * Creates a clone of the current StringBuilder instance.
     * The internal segments are copied to ensure isolated mutation.
     *
     * @returns A new StringBuilder with the same content.
     */
    public clone(): StringBuilder;

    /**
     * Total number of characters in the builder.
     */
    public readonly length: number;

    /**
     * Number of segments appended.
     */
    public readonly segmentCount: number;

    /**
     * Indicates whether the builder is empty.
     */
    public readonly isEmpty: boolean;

    /**
     * Allows implicit conversion to string (e.g., `${builder}`).
     *
     * @param hint The type hint provided by the JavaScript engine.
     * @returns The string representation of the builder.
     */
    public [Symbol.toPrimitive](hint: string): string;
}

/**
 * A StringBuilder that tracks the current output line and column.
 * This class extends StringBuilder to provide position tracking
 * for text output, allowing you to know where the next output will occur.
 */
export declare class TrackingStringBuilder extends StringBuilder {
    /**
     * The current output line number, starting from 1.
     * This is incremented whenever a newline is appended.
     */
    public outputLine: number;

    /**
     * The current output column number, starting from 0.
     * This is incremented as characters are appended, and reset to 0 on new lines.
     */
    public outputColumn: number;

    /**
     * Appends the given string to the builder and updates the output position.
     *
     * @param value The string to append.
     * @returns The current instance for chaining.
     */
    public override append(value: string): this;

    /**
     * Appends the given escaped string to the builder and updates the output position.
     *
     * @param value The string to append.
     * @returns The current instance for chaining.
     */
    public override appendEscaped(value: string): this;

    /**
     * Appends the given string followed by a newline and updates the output position.
     *
     * @param value The string to append before the newline. Defaults to an empty string.
     * @returns The current instance for chaining.
     */
    public override appendLine(value?: string): this;

    /**
     * Appends the given string after escaping it for safe HTML output, followed by a newline,
     * and updates the output position.
     *
     * @param value The string to append, which will be escaped. Defaults to an empty string.
     * @returns The current instance for chaining.
     */
    public override appendLineEscaped(value?: string): this;

    /**
     * Appends a formatted string where placeholders {0}, {1}, ... are replaced by args,
     * and updates the output position.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     * @throws {ArgumentNullException} If the format string is null, empty, or whitespace.
     */
    public override appendFormat(format: string, ...args: any[]): this;

    /**
     * Appends an escaped formatted string where placeholders {0}, {1}, ... are replaced by args,
     * and updates the output position.
     *
     * @param format The format string containing placeholders.
     * @param args The values to replace placeholders with.
     * @returns The current instance for chaining.
     * @throws {ArgumentNullException} If the format string is null, empty, or whitespace.
     */
    public override appendFormatEscaped(format: string, ...args: any[]): this;

    /**
     * Clears the content of the builder and resets the output position.
     * This method overrides the base clear method to also reset position tracking.
     */
    public override clear(): void;

    /**
     * Unsupported operation in TrackingStringBuilder.
     * This method is not implemented because TrackingStringBuilder
     * does not support inserting segments at arbitrary positions.
     * @throws {TrackingStringBuilderException} Always thrown to indicate unsupported operation.
     */
    public override insert(index: number, value: string): this;

    /**
     * Unsupported operation in TrackingStringBuilder.
     * This method is not implemented because TrackingStringBuilder
     * does not support removing segments at arbitrary positions.
     * @throws {TrackingStringBuilderException} Always thrown to indicate unsupported operation.
     */
    public override removeSegment(index: number, count: number): this;

    /**
     * Unsupported operation in TrackingStringBuilder.
     * This method is not implemented because TrackingStringBuilder
     * does not support replacing segments at arbitrary positions.
     * @throws {TrackingStringBuilderException} Always thrown to indicate unsupported operation.
     */
    public override replaceSegment(index: number, value: string): this;

    /**
     * Creates a clone of the current TrackingStringBuilder instance.
     * The internal segments and position tracking are copied to ensure isolated mutation.
     *
     * @returns A new TrackingStringBuilder with the same content and position tracking.
     */
    public override clone(): TrackingStringBuilder;
}

/**
 * Base class for text-related exceptions.
 * Extends SystemException to provide common functionality for text errors.
 */
export declare class TextException extends SystemException {
    /**
     * Creates a new TextException with the specified message and options.
     *
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message: string, options?: ErrorOptions);
}

/**
 * Exception thrown by TrackingStringBuilder methods that are not supported.
 * This exception is used to indicate that certain operations are not allowed
 * in a TrackingStringBuilder context, such as insert, removeSegment, and replaceSegment.
 */
export declare class TrackingStringBuilderException extends TextException {
    /**
     * Creates a new TrackingStringBuilderException with the specified message and options.
     *
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message: string, options?: ErrorOptions);
}