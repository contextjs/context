/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ArgumentOutOfRangeException, StringExtensions, Throw } from "@contextjs/system";

export class StringBuilder {
    protected _segments: string[] = [];
    protected _length: number = 0;

    public append(value: string): this {
        this._segments.push(value);
        this._length += value.length;

        return this;
    }

    public appendEscaped(value: string): this {
        return this.append(StringExtensions.escape(value));
    }

    public appendLine(value: string = StringExtensions.empty): this {
        this._segments.push(value, StringExtensions.newLine);
        this._length += value.length + StringExtensions.newLine.length;

        return this;
    }

    public appendLineEscaped(value: string = StringExtensions.empty): this {
        return this.appendLine(StringExtensions.escape(value));
    }

    public appendFormat(format: string, ...args: any[]): this {
        Throw.ifNullOrWhitespace(format);

        const formatted = StringExtensions.format(format, ...args);
        this._segments.push(formatted);
        this._length += formatted.length;

        return this;
    }

    public appendFormatEscaped(format: string, ...args: any[]): this {
        const formatted = StringExtensions.format(format, ...args);
        return this.append(StringExtensions.escape(formatted));
    }

    public insert(index: number, value: string): this {
        if (index < 0 || index > this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        this._segments.splice(index, 0, value);
        this._length += value.length;
        return this;
    }

    public removeSegment(index: number, count: number = 1): this {
        if (index < 0 || index >= this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        const removed = this._segments.splice(index, count);
        removed.forEach(seg => this._length -= seg.length);
        return this;
    }

    public replaceSegment(index: number, value: string): this {
        if (index < 0 || index >= this._segments.length)
            throw new ArgumentOutOfRangeException(`Index out of range: ${index}. Valid range: 0 to ${this._segments.length - 1}`);

        const old = this._segments[index];
        this._segments[index] = value;
        this._length += value.length - old.length;
        return this;
    }

    public clear(): void {
        this._segments.length = 0;
        this._length = 0;
    }

    public toString(): string {
        return this._segments.join(StringExtensions.empty);
    }

    public toArray(): string[] {
        return [...this._segments];
    }

    public clone(): StringBuilder {
        const builder = new StringBuilder();
        builder._segments = [...this._segments];
        builder._length = this._length;
        return builder;
    }

    public get length(): number {
        return this._length;
    }

    public get segmentCount(): number {
        return this._segments.length;
    }

    public get isEmpty(): boolean {
        return this._length === 0;
    }

    public [Symbol.toPrimitive](_hint: string): string {
        return this.toString();
    }
}