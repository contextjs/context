/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { StringExtensions } from "@contextjs/system";
import { TrackingStringBuilder } from "@contextjs/text";
import type { LocationSyntaxNode, ParserResult } from "@contextjs/views-parser";
import { GeneratorState } from "../../enums/generator-state.js";
import type { ISourceMapWriter } from "../../interfaces/i-source-map-writer.js";

export class ServerCodeGeneratorContext {
    public readonly valueBuilder: TrackingStringBuilder;
    public readonly state: Stack<GeneratorState>;
    public readonly parserResult: ParserResult;
    public readonly sourceMapWriter: ISourceMapWriter;
    public readonly filePath: string;

    private pendingLiteralBuilder: TrackingStringBuilder = new TrackingStringBuilder();
    private pendingLiteralNode: LocationSyntaxNode | null = null;

    public constructor(
        parserResult: ParserResult,
        filePath: string,
        sourceMapWriter: ISourceMapWriter) {
        this.valueBuilder = new TrackingStringBuilder();
        this.state = new Stack<GeneratorState>();
        this.parserResult = parserResult;
        this.filePath = filePath;
        this.sourceMapWriter = sourceMapWriter;
    }

    public appendToPendingLiteral(text: string, node: LocationSyntaxNode) {
        if (this.pendingLiteralBuilder.length === 0)
            this.pendingLiteralNode = node;

        this.pendingLiteralBuilder.append(text);
    }

    public flushPendingLiteral() {
        if (this.pendingLiteralBuilder.length > 0 && this.pendingLiteralNode) {
            const escaped = StringExtensions.escapeCode(this.pendingLiteralBuilder.toString());
            this.valueBuilder.appendLine(`        this.writeLiteral("${escaped}");`);

            this.sourceMapWriter.addMapping({
                generated: {
                    line: this.valueBuilder.outputLine,
                    column: this.valueBuilder.outputColumn
                },
                original: {
                    line: this.pendingLiteralNode.location.startLineIndex + 1,
                    column: this.pendingLiteralNode.location.startCharacterIndex
                },
                source: this.filePath
            });
        }
        this.pendingLiteralBuilder.clear();
        this.pendingLiteralNode = null;
    }
}