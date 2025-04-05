# @contextjs/parser

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/parser?cache=300)](https://www.npmjs.com/package/@contextjs/parser)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

ContextJS components parser

### Installation

```
npm i @contextjs/parser
```

### Parser

```typescript
/**
 * The Parser class is responsible for orchestrating the parsing of a file or content and managing diagnostics.
 * It processes the code and produces an array of syntax nodes and diagnostics.
 */
export class Parser {
    /**
     * Parses the text and produces a ParserResult containing syntax nodes and diagnostics.
     * 
     * @param {string} text - The text to be parsed.
     * 
     * @returns {ParserResult} - The result of parsing the text, including syntax nodes and diagnostics.
     */
    public static parse(text: string): ParserResult;
}

/**
 * The ParserResult class represents the result of parsing a file or content.
 * It contains an array of syntax nodes and diagnostics generated during the parsing process.
 */
export class ParserResult {
    /**
     * The list of diagnostics generated during parsing.
     */
    public diagnostics: Diagnostic[];

    /**
     * The list of syntax nodes produced by parsing the content.
     */
    public nodes: SyntaxNode[];
}
```

### Classes

```typescript
/**
 * The Source class represents the content of a source file and provides methods for working with the content.
 */
export declare class Source {
    /**
     * The content of the source file.
     */
    public readonly content: string;

    /**
     * The lines of the source file.
     */
    public readonly lines: LineInfo[];

    /**
     * Constructs a new Source instance.
     * 
     * @param {string} content - The content of the source file.
     */
    public constructor(content: string);

    /**
     * Gets the location at the specified position.
     * 
     * @param {number} startIndex - The start index of the location.
     * @param {number} endIndex - The end index of the location.
     * 
     * @returns {Location} - The location at the specified index.
     */
    public getLocation(startIndex: number, endIndex: number, text: string): Location;
}

/**
 * The Diagnostic class represents a diagnostic message that indicates information, warnings, or errors
 * encountered during parsing. It includes the severity of the diagnostic, its location, and a descriptive message.
 */
export declare class Diagnostic {

    /**
     * The severity level of the diagnostic (Info, Warning, or Error).
     */
    public readonly severity: DiagnosticSeverity;

    /**
     * The location in the source where the diagnostic occurred.
     */
    public readonly location: Location | null;

    /**
     * The message describing the diagnostic.
     */
    public readonly message: string;

    /**
     * Creates a new Diagnostic instance.
     * @param {DiagnosticSeverity} severity - The severity level of the diagnostic (Info, Warning, or Error).
     * @param {string} message - The message describing the diagnostic.
     */
    constructor(severity: DiagnosticSeverity, message: string);

    /**
     * Creates a new Diagnostic instance.
     * @param {DiagnosticSeverity} severity - The severity level of the diagnostic (Info, Warning, or Error).
     * @param {string} message - The message describing the diagnostic.
     * @param {Location} location - The location in the source where the diagnostic occurred.
     */
    constructor(severity: DiagnosticSeverity, message: string, location: Location);

    /**
     * Creates an informational diagnostic.
     * @param {string} message - The informational message.
     * 
     * @returns {Diagnostic} - A Diagnostic with severity set to Info.
     */
    public static info(message: string): Diagnostic;

    /**
     * Creates an informational diagnostic.
     * @param {string} message - The informational message.
     * @param {Location} location - The location where the informational message applies.
     * 
     * @returns {Diagnostic} - A Diagnostic with severity set to Info.
     */
    public static info(message: string, location: Location): Diagnostic;

    /**
     * Creates a warning diagnostic.
     * @param {string} message - The warning message.
     * 
     * @returns {Diagnostic} - A Diagnostic with severity set to Warning.
     */
    public static warning(message: string): Diagnostic;

    /**
     * Creates a warning diagnostic.
     * @param {string} message - The warning message.
     * @param {Location} location - The location where the warning occurred.
     * 
     * @returns {Diagnostic} - A Diagnostic with severity set to Warning.
     */
    public static warning(message: string, location: Location): Diagnostic;

    /**
     * Creates an error diagnostic.
     * @param {string} message - The error message.
     * @returns {Diagnostic} - A Diagnostic with severity set to Error.
     * 
     */
    public static error(message: string): Diagnostic;

    /**
     * Creates an error diagnostic.
     * @param {string} message - The error message.
     * @param {Location} location - The location where the error occurred.
     * 
     * @returns {Diagnostic} - A Diagnostic with severity set to Error.
     */
    public static error(message: string, location: Location): Diagnostic;

    /**
     * Returns a string representation of the diagnostic.
     * 
     * @returns {string} - The string representation of the diagnostic.
     */
    public toString(): string;
}

/**
 * The Location class represents a specific location within a source.
 * It includes details about the span of text, and the line and character indexes.
 */
export class Location {
    /**
     * The line index where the source span starts (0-based).
     */
    public readonly startLineIndex: number;

    /**
     * The character index within the line where the source span starts (0-based).
     */
    public readonly startCharacterIndex: number;

    /**
     * The line index where the source span ends (0-based).
     */
    public readonly endLineIndex: number;

    /**
     * The character index within the line where the source span ends (0-based).
     */
    public readonly endCharacterIndex: number;

    /**
     * The text span of the source location.
     */
    public readonly text: string;

    /**
     * The lines of the source location.
     */
    public readonly lines: LineInfo[];

    /**
     * Constructs a new SourceLocation instance.
     * 
     * @param {number} startLineIndex - The line index where the source starts (0-based).
     * @param {number} startCharacterIndex - The character index within the line where the source starts (0-based).
     * @param {number} endLineIndex - The line index where the source ends (0-based).
     * @param {number} endCharacterIndex - The character index within the line where the source ends (0-based).
     * @param {string} text - The text span of the source location.
     * @param {LineInfo[]} lines - The lines of the source location.
     */
    constructor(startLineIndex: number, startCharacterIndex: number, endLineIndex: number, endCharacterIndex: number, text: string, lines: LineInfo[])

    /**
     * Returns a string representation of the source location.
     * 
     * @returns {string} - The string representation of the source location.
     */
    public toString(): string;
}

/**
 * Represents information about a line in a file, including its index and the start and end character indexes.
 */
export class LineInfo {

    /**
     * The index of the line.
     * @type {number}
     */
    public readonly lineIndex: number;

    /**
     * The starting character index of the line.
     * @type {number}
     */
    public readonly startCharacterIndex: number;

    /**
     * The ending character index of the line.
     * @type {number}
     */
    public readonly endCharacterIndex: number;

    /**
     * Constructs a LineInfo instance.
     * @param {number} lineIndex - The index of the line.
     * @param {number} startCharacterIndex - The starting character index of the line.
     * @param {number} endCharacterIndex - The ending character index of the line.
     */
    constructor(lineIndex: number, startCharacterIndex: number, endCharacterIndex: number);
}
```

### Enums

/**
 * Enum representing the severity levels of diagnostics that can be generated by the parser.
 * 
 * - `Info`: Provides informational messages that do not indicate a problem.
 * - `Warning`: Indicates a potential issue or something that might require attention, but not necessarily an error.
 * - `Error`: Represents a critical problem that prevents the successful parsing of the code.
 */
export declare enum DiagnosticSeverity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}

/**
 * The ComponentType enumeration represents the type of a component.
 */
export declare enum ComponentType {
    Component = "Component",
    Layout = "Layout"
}
```