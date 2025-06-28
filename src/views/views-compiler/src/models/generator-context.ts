/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { TrackingStringBuilder } from "@contextjs/text";
import type { ParserResult } from "@contextjs/views-parser";
import { GeneratorState } from "../enums/generator-state.js";
import type { ISourceMapWriter } from "../interfaces/i-source-map-writer.js";
import { NoopSourceMapWriter } from "../no-op-source-map-writer.js";

export class GeneratorContext {
    public readonly valueBuilder: TrackingStringBuilder;
    public readonly state: Stack<GeneratorState>;
    public readonly parserResult: ParserResult;
    public readonly sourceMapWriter: ISourceMapWriter;
    public readonly filePath: string;

    public constructor(parserResult: ParserResult, filePath: string, sourceMapWriter?: ISourceMapWriter) {
        this.valueBuilder = new TrackingStringBuilder();
        this.state = new Stack<GeneratorState>();
        this.parserResult = parserResult;
        this.filePath = filePath;
        this.sourceMapWriter = sourceMapWriter ?? new NoopSourceMapWriter();
    }
}