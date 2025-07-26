/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/**
 * Represents a diagnostic message in the system.
 */
export declare class Diagnostic {
    /**
     * The severity of the diagnostic message.
     */
    public readonly severity: DiagnosticSeverity;
    /**
     * The diagnostic message.
     */
    public readonly message: DiagnosticMessage;
    /**
     * The location associated with the diagnostic message, if any.
     */
    public readonly location: Location | null;

    /**
     * Creates a new diagnostic message with the specified severity and message.
     * @param severity The severity of the diagnostic message.
     * @param message The diagnostic message.
     * @param location The location associated with the diagnostic message, if any.
     */
    public constructor(severity: DiagnosticSeverity, message: DiagnosticMessage);
    public constructor(severity: DiagnosticSeverity, message: DiagnosticMessage, location: Location | null);


    /**
     * Creates an Info diagnostic message
     * 
     * @param message The diagnostic message.
     * @param location The location associated with the diagnostic message, if any.
     * @returns A new Diagnostic instance with severity set to Info.
     */
    public static info(message: DiagnosticMessage): Diagnostic;
    public static info(message: DiagnosticMessage, location: Location | null): Diagnostic;

    /**
     * Creates a Warning diagnostic message
     * 
     * @param message The diagnostic message.
     * @param location The location associated with the diagnostic message, if any.
     * @returns A new Diagnostic instance with severity set to Warning.
     */
    public static warning(message: DiagnosticMessage): Diagnostic;
    public static warning(message: DiagnosticMessage, location: Location | null): Diagnostic;

    /**
     * Creates an Error diagnostic message
     * 
     * @param message The diagnostic message.
     * @param location The location associated with the diagnostic message, if any.
     * @returns A new Diagnostic instance with severity set to Error.
     */
    public static error(message: DiagnosticMessage): Diagnostic;
    public static error(message: DiagnosticMessage, location: Location | null): Diagnostic;

    public toString(): string;
}

/**
 * Represents a diagnostic message with a code and text.
 */
export declare class DiagnosticMessage {
    /**
     * The code of the diagnostic message.
     */
    public readonly code: number;
    /**
     * The text of the diagnostic message.
     */
    public readonly message: string;

    /**
     * Creates a new diagnostic message with the specified code and text.
     * @param code The code of the diagnostic message.
     * @param message The text of the diagnostic message.
     */
    public constructor(code: number, message: string);
}

/**
 * Represents the severity of a diagnostic message.
 */
export declare enum DiagnosticSeverity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}

/**
 * Represents a location in a source file, including the start and end positions, text, and lines.
 * This class is used to provide context for diagnostics and other source-related operations.
*/
export declare class Location {
    /**
     * The index of the starting line in the source file.
     */
    public readonly startLineIndex: number;
    /**
     * The character index at the start of the location in the source file.
     */
    public readonly startCharacterIndex: number;
    /**
     * The index of the ending line in the source file.
     */
    public readonly endLineIndex: number;
    /**
     * The character index at the end of the location in the source file.
     */
    public readonly endCharacterIndex: number;
    /**
     * The absolute character index at the start of the location in the source file.
     */
    public readonly absoluteStartCharacterIndex: number;
    /**
     * The absolute character index at the end of the location in the source file.
     */
    public readonly absoluteEndCharacterIndex: number;
    /**
     * The text contained within this location in the source file.
     */
    public readonly text: string;
    /**
     * An array of LineInfo objects representing the lines in this location.
     */
    public readonly lines: LineInfo[];

    /**
     * Creates a new Location instance with the specified start and end positions, text, and lines.
     * @param startLineIndex The index of the starting line .
     * @param startCharacterIndex The character index at the start of the location (inclusive).
     * @param endLineIndex The index of the ending line.
     * @param endCharacterIndex The character index at the end of the location (exclusive).
     * @param absoluteStartCharacterIndex The absolute character index at the start of the location (inclusive).
     * @param absoluteEndCharacterIndex The absolute character index at the end of the location (exclusive).
     * @param text The text contained within this location.
     * @param lines An array of LineInfo objects representing the lines in this location.
     */
    public constructor(
        startLineIndex: number,
        startCharacterIndex: number,
        endLineIndex: number,
        endCharacterIndex: number,
        absoluteStartCharacterIndex: number,
        absoluteEndCharacterIndex: number,
        text: string,
        lines: LineInfo[]);
}

/**
 * Represents information about a line in a source file, including its index and character indices.
 * This class is used to provide detailed line-level context for diagnostics and other source-related operations.
 */
export declare class LineInfo {
    /**
     * The index of the line in the source file.
     */
    public readonly index: number;
    /**
     * The character index at the start of the line in the source file.
     */
    public readonly startCharacterIndex: number;
    /**
     * The character index at the end of the line in the source file.
     */
    public readonly endCharacterIndex: number;
    /**
     * The text content of the line in the source file.
     */
    public readonly text: string;

    /**
     * Creates a new LineInfo instance with the specified index and character indices.
     * @param index The index of the line in the source file.
     * @param startCharacterIndex The character index at the start of the line (inclusive).
     * @param endCharacterIndex The character index at the end of the line (exclusive).
     * @param text The text content of the line.
     */
    public constructor(index: number, startCharacterIndex: number, endCharacterIndex: number, text: string);
}

/**
 * Represents a collection of diagnostic messages used throughout the system.
 */
export declare class DiagnosticMessages {
    public static readonly InvalidComment: DiagnosticMessage;
    public static readonly UnterminatedComment: (endTag: string) => DiagnosticMessage;

    public static readonly InvalidName: DiagnosticMessage;
    public static readonly UnterminatedAttributeValue: DiagnosticMessage;
    public static readonly InvalidAttributeValue: DiagnosticMessage;
    public static readonly ExpectedEquals: DiagnosticMessage;
    public static readonly InvalidTagFormat: DiagnosticMessage;
    public static readonly ExpectedCDATAStart: DiagnosticMessage;
    public static readonly MissingCDATAEnd: DiagnosticMessage;
    public static readonly InvalidTagName: (name: string) => DiagnosticMessage;
    public static readonly UnterminatedTag: (tagName: string) => DiagnosticMessage;
    public static readonly MismatchedEndTag: (expectedTagName: string, tagName: string) => DiagnosticMessage;
    public static readonly EmptyAttributeValue: DiagnosticMessage;
    public static readonly ExpectedEndStyleTag: (name: string) => DiagnosticMessage;
    public static readonly ExpectedEndScriptTag: (name: string) => DiagnosticMessage;
    public static readonly UnterminatedDoctype: DiagnosticMessage;

    public static readonly ExpectedTransitionMarker: (character: string) => DiagnosticMessage;
    public static readonly ExpectedBracket: (character: string) => DiagnosticMessage;
    public static readonly ExpectedBrace: (character: string) => DiagnosticMessage;
    public static readonly NoWhitespaceAfterTransition: DiagnosticMessage;
    public static readonly MalformedCodeBlock: DiagnosticMessage;
    public static readonly UnexpectedTransition: DiagnosticMessage;
    public static readonly UnexpectedCodeBlock: DiagnosticMessage;

    public static readonly UnexpectedEndOfInput: DiagnosticMessage;
    public static readonly UnsupportedLanguage: DiagnosticMessage;
    public static readonly UnsupportedProjectType: (projectType: string) => DiagnosticMessage;
    public static readonly FileNotFound: (filePath: string) => DiagnosticMessage;
    public static readonly UnknownCompilationContextFile: (filePath: string) => DiagnosticMessage;
}

/**
 * Represents a source containing text content.
 * This class provides methods to retrieve line information and locations within the source.
 */
export declare class Source {
    /**
     * The content of the source.
     */
    public readonly content: string;

    /**
     * The lines of the source.
     */
    public readonly lines: LineInfo[];

    /**
     * Creates a new Source instance with the specified content.
     * @param content The text content of the source.
     */
    public constructor(content: string);

    /**
     * Gets the Location for the specified start and end indices in the source text.
     * @param startIndex The starting index in the source text (inclusive).
     * @param endIndex The ending index in the source text (exclusive).
     * @returns A Location object representing the specified range [startIndex, endIndex) in the source.
     */
    public getLocation(startIndex: number, endIndex: number): Location;
}

/**
 * Represents a compiled view output file.
 * This interface is used to define the structure of files generated by view providers.
 */
export declare interface IViewOutputFile {
    /** 
     * The output path, relative to the root of the provider
    */
    filename: string;

    /** 
     * The compiled TypeScript code for this view. 
    */
    code: string;

    /** 
     * The source map as a string, if generated. 
    */
    map?: string;
}

export declare interface IViewOutputProvider {
    /**
     * Writes a compiled view output to the provider.
     * Overwrites any existing file at the same path.
     * @param file The view output file to write.
     * @returns A promise that resolves when the write operation is complete.
     */
    writeAsync(file: IViewOutputFile): Promise<void>;

    /**
     * Reads a compiled view output from the provider.
     * Returns null if the file does not exist.
     * @param filename The name of the file to read.
     * @returns A promise that resolves to the view output file or null if not found.
     */
    readAsync(filename: string): Promise<IViewOutputFile | null>;

    /**
     * Deletes a compiled view output.
     * Does nothing if the file does not exist.
     * @param filename The name of the file to delete.
     * @returns A promise that resolves when the delete operation is complete.
     */
    deleteAsync(filename: string): Promise<void>;

    /**
     * Returns a list of all output files managed by this provider.
     * Each is returned as an IViewOutputFile (filename + code + map).
     * @returns A promise that resolves to an array of IViewOutputFile objects.
     * If no files are found, returns an empty array.
     */
    listAsync(): Promise<IViewOutputFile[]>;
}

/**
 * Represents the base class for views in the system.
 */
export abstract class ViewBase<T> {
    /**
     * Writes a literal string to the output.
     * @param text The literal text to write.
     * This method appends the text directly to the output without escaping it.
     */
    protected abstract writeLiteral(text: string): void;

    /**
     * Writes a value to the output, escaping it if necessary.
     * @param value The value to write. If null or undefined, nothing is written.
     * This method escapes the value before appending it to the output.
     */
    protected abstract write(value: string | null | undefined): void;

    /**
     * Escapes a string value for safe output.
     * @param value The string to escape.
     * @returns The escaped string.
     * This method ensures that special characters are properly escaped for output.
     */
    protected abstract escape(value: string): string;

    /**
     * Gets the final output as a string.
     * @returns The accumulated output as a string.
     * This method returns the complete output generated by the view.
     */
    protected abstract getOutput(): T;
}

/**
 * Represents a server-side view in the system.
 */
export declare abstract class ServerView extends ViewBase<string> {

    /**
     * Writes a literal string to the output without escaping it.
     * @param text The literal text to write.
     */
    protected override writeLiteral(text: string): void;

    /**
     * Writes a value to the output, escaping it if necessary.
     * @param value The value to write. If null or undefined, nothing is written.
     */
    protected override write(value: string | null | undefined): void;

    /**
     * Escapes a string value for safe output.
     * @param value The string to escape.
     * @returns The escaped string.
     */
    protected override escape(value: string): string;

    /**
     * Gets the final output as a string.
     * @returns The accumulated output as a string.
     */
    protected override getOutput(): string;
}

/**
 * Represents the language used in the system.
 * This enum defines the supported languages for views.
 */
export declare enum Language {
    TSHTML = 'tshtml'
}

/**
 * Provides utility methods for working with languages.
 */
export declare class LanguageExtensions {
    /**
     * Converts a string to its corresponding Language enum value.
     * @param value The string representation of the language.
     * @returns The Language enum value or null if the string does not match any known language.
     */
    public static fromString(value: string): Language | null;
}