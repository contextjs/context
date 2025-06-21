/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export declare class Parser {
    public static parse(text: string, language: Language): ParserResult;
}

export declare enum Language {
    TSHTML = 'tshtml'
}

export class LanguageExtensions {
    public static fromString(value: string): Language | null;
}

export declare class ParserResult {
    public diagnostics: Diagnostic[];
    public nodes: SyntaxNode[];
}

export declare abstract class SyntaxNode {
    public readonly trivia: TriviaSyntaxNode | null;
}

export declare class TriviaSyntaxNode extends ValueSyntaxNode { }

export declare abstract class ValueSyntaxNode extends LocationSyntaxNode { }

export declare abstract class LocationSyntaxNode extends SyntaxNode {
    public readonly location: Location;
}

export declare class Diagnostic {
    public readonly severity: DiagnosticSeverity;
    public readonly message: DiagnosticMessage;
    public readonly location: Location | null;
}

export declare class DiagnosticMessage {
    public readonly code: number;
    public readonly message: string;
}

export declare enum DiagnosticSeverity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}

export declare class Location {
    public readonly startLineIndex: number;
    public readonly startCharacterIndex: number;
    public readonly endLineIndex: number;
    public readonly endCharacterIndex: number;
    public readonly text: string;
    public readonly lines: LineInfo[];
}

export declare class LineInfo {
    public readonly index: number;
    public readonly startCharacterIndex: number;
    public readonly endCharacterIndex: number;
}