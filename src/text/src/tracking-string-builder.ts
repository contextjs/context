/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { TrackingStringBuilderException } from "./exceptions/tracking-string-builder.exception.js";
import { StringBuilder } from "./string-builder.js";

export class TrackingStringBuilder extends StringBuilder {
    public outputLine: number = 1;
    public outputColumn: number = 0;

    public override append(value: string): this {
        super.append(value);
        this.updatePosition(value);

        return this;
    }

    public override appendEscaped(value: string): this {
        const escaped = StringExtensions.escape(value);
        super.append(escaped);
        this.updatePosition(escaped);

        return this;
    }

    public override appendLine(value: string = StringExtensions.empty): this {
        super.appendLine(value);
        this.updatePosition(value + StringExtensions.newLine);

        return this;
    }

    public override appendLineEscaped(value: string = StringExtensions.empty): this {
        const escaped = StringExtensions.escape(value);
        super.appendLine(escaped);
        this.updatePosition(escaped + StringExtensions.newLine);

        return this;
    }

    public override appendFormat(format: string, ...args: any[]): this {
        const formatted = StringExtensions.format(format, ...args);
        super.append(formatted);
        this.updatePosition(formatted);

        return this;
    }

    public override appendFormatEscaped(format: string, ...args: any[]): this {
        const formatted = StringExtensions.format(format, ...args);
        const escaped = StringExtensions.escape(formatted);
        super.append(escaped);
        this.updatePosition(escaped);

        return this;
    }

    public override clear(): void {
        super.clear();
        this.outputLine = 1;
        this.outputColumn = 0;
    }

    public override insert(index: number, value: string): this {
        throw new TrackingStringBuilderException("TrackingStringBuilder does not support insert(). Use append/appendLine only for position tracking.");
    }

    public override removeSegment(index: number, count: number = 1): this {
        throw new TrackingStringBuilderException("TrackingStringBuilder does not support removeSegment(). Use append/appendLine only for position tracking.");
    }

    public override replaceSegment(index: number, value: string): this {
        throw new TrackingStringBuilderException("TrackingStringBuilder does not support replaceSegment(). Use append/appendLine only for position tracking.");
    }

    public override clone(): TrackingStringBuilder {
        const clone = new TrackingStringBuilder();
        clone._segments = [...this._segments];
        clone._length = this.length;
        clone.outputLine = this.outputLine;
        clone.outputColumn = this.outputColumn;

        return clone;
    }

    private updatePosition(emitted: string): void {
        const lines = emitted.split('\n');
        if (lines.length === 1)
            this.outputColumn += emitted.length;
        else {
            this.outputLine += lines.length - 1;
            this.outputColumn = lines[lines.length - 1].length;
        }
    }
}