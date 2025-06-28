/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

//#region Application

/**
 * Represents the main application.
 */
export declare class Application {
    /**
     * The environment in which the application is running.
     */
    public readonly environment: Environment;

    /**
     * Runs the application asynchronously.
     * @returns {Promise<Application>} A promise that resolves to the application instance.
     */
    public runAsync(): Promise<Application>;

    /**
     * Adds a function to be executed when the application runs.
     * If you need to run multiple functions, use the `onRun` method multiple times.
     * All functions will be executed in parallel.
     * @param {() => Promise<any>} func The function to execute.
     * @returns {Application} The application instance.  
     * 
     */
    public onRun(func: () => Promise<any>): Application;
}

//#endregion

//#region Exceptions

/**
 * Represents a general-purpose application exception.
 */
export declare class Exception extends Error {
    /**
     * Initializes a new instance of the Exception class.
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message: string, options?: ErrorOptions);
}

/**
 * Represents a generic system-level exception.
 */
export declare class SystemException extends Exception {
    /**
     * Initializes a new instance of the SystemException class.
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message?: string, options?: ErrorOptions);
}

/**
 * Represents an exception thrown when an argument is invalid.
 */
export declare class ArgumentException extends SystemException {
    /**
     * Initializes a new instance of the ArgumentException class.
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message?: string, options?: ErrorOptions);
}

/**
 * Represents an exception thrown when an argument is out of range.
 */
export declare class ArgumentOutOfRangeException extends ArgumentException {
    /**
     * Initializes a new instance of the ArgumentOutOfRangeException class.
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message?: string, options?: ErrorOptions);
}

/**
 * Represents an exception thrown when a null value is encountered unexpectedly.
 */
export declare class NullReferenceException extends Exception {
    /**
     * Initializes a new instance of the NullReferenceException class.
     * @param message The error message.
     * @param options Optional error options.
     */
    constructor(message?: string, options?: ErrorOptions);
}

/**
 * Represents an exception thrown when a provided expression is not valid for extraction.
 */
export declare class InvalidExpressionException extends SystemException {
    /**
     * Creates a new instance of the InvalidExpressionException class.
     *
     * @param message The error message that explains the reason for the exception.
     * @param options Optional error options.
     */
    constructor(message: string, options?: ErrorOptions);
}

//#endregion

//#region Extensions

/**
 * A utility class for extending objects.
 */
export declare class ObjectExtensions {
    /**
     * Checks if the given value is null or undefined.
     * @param {any} value - The value to check.
     * @returns {value is null | undefined} True if the value is null or undefined, otherwise false.
     */
    public static isNullOrUndefined(value: any): value is null | undefined;

    /**
     * Checks if the given value is null.
     * @param {any} value - The value to check.
     * @returns {value is null} True if the value is null, otherwise false.
     */
    public static isNull(value: any): value is null;

    /**
     * Checks if the given value is undefined.
     * @param {any} value - The value to check.
     * @returns {value is undefined} True if the value is undefined, otherwise false.
     */
    public static isUndefined(value: any): value is undefined;
}

/**
 * A utility class for extending strings.
 */
export declare class StringExtensions {
    /**
     * Represents an empty string.
     */
    public static readonly empty: string;

    /**
     * Represents a new line, platform-specific.
     */
    public static readonly newLine: string;

    /**
     * Checks if the given string is null or empty.
     * @param value The string to check.
     * @returns {value is null | undefined | ""} True if the string is null or empty.
     */
    public static isNullOrEmpty(value: string | null | undefined): value is null | undefined | "";

    /**
     * Checks if the given value is null or undefined.
     * @param value The value to check.
     * @returns {value is null | undefined} True if null or undefined.
     */
    public static isNullOrUndefined(value: string | null | undefined): value is null | undefined;

    /**
     * Checks if the string is null, empty, or only whitespace.
     * @param value The string to check.
     * @returns {value is null | undefined | ""} True if null, empty, or only whitespace.
     */
    public static isNullOrWhitespace(value: string | null | undefined): value is null | undefined | "";

    /**
     * Removes all whitespace characters from the string.
     * @param value The string to process.
     * @returns {string} The trimmed string.
     */
    public static removeWhitespace(value: string): string;

    /**
     * Checks if the character is a line break character.
     * @param character The character to check.
     * @returns {boolean} True if line break.
     */
    public static isLineBreak(character: string): boolean;

    /**
     * Checks if the character is a digit.
     * @param character The character to check.
     * @returns {boolean} True if digit.
     */
    public static isDigit(character: string): boolean;

    /**
     * Checks if the character is a Unicode letter.
     * @param character The character to check.
     * @returns {boolean} True if letter.
     */
    public static isLetter(character: string): boolean;

    /**
     * Checks if the character is a letter or digit.
     * @param character The character to check.
     * @returns {boolean} True if letter or digit.
     */
    public static isLetterOrDigit(character: string): boolean;

    /**
     * Checks if the character is a whitespace character.
     * @param character The character to check.
     * @returns {boolean} True if whitespace.
     */
    public static isWhitespace(character: string): boolean;

    /**
     * Checks if a string contains only whitespace characters (or is empty).
     * @param value The string to check.
     * @returns {boolean} True if only whitespace or empty.
     */
    public static containsOnlyWhitespace(value: string): boolean;

    /**
     * Formats a string using positional arguments.
     * @param template The format string.
     * @param args The values to insert.
     * @returns {string} The formatted string.
     */
    public static format(template: string, ...args: any[]): string;

    /**
     * Escapes special characters in a string for safe use in code.
     * @param value The string to escape.
     * @returns {string} The escaped string.
     */
    public static escape(value: string): string
}

/**
 * Class that represents project type extensions.
 */
export class ProjectTypeExtensions {
    /**
     * Converts the project type to a string.
     * @param {ProjectType} projectType - The project type to convert.
     * @returns {string | null} The string representation of the project type or null if the project type is invalid.
     */
    public static toString(projectType: ProjectType): string | null;

    /**
     * Converts the string to a project type.
     * @param {string} value - The string to convert.
     * @returns {ProjectType | null} The project type or null if the string is invalid.
     */
    public static fromString(value: string): ProjectType | null;
}

//#endregion

//#region Models

/**
 * Class that represents a console argument.
 */
export declare class ConsoleArgument {
    /**
     * The name of the console argument.
     */
    public name: string;

    /**
     * The values associated with the console argument.
     */
    public values: string[];

    /**
     * Creates an instance of ConsoleArgument.
     * @param {string} name - The name of the argument.
     * @param {string[]} values - The values associated with the argument.
     */
    constructor(name: string, values: string[]);

    /**
     * Converts the console argument to a string.
     * @returns {string} The string representation of the console argument.
     */
    public toString(): string;
}

export type ConsoleMessage = {
    format: ForegroundColors | BackgroundColors | Modifiers | Array<ForegroundColors | BackgroundColors | Modifiers>,
    text: string
};

export declare type Modifiers =
    'blink' |
    'bold' |
    'dim' |
    'doubleunderline' |
    'framed' |
    'hidden' |
    'inverse' |
    'italic' |
    'overlined' |
    'reset' |
    'strikethrough' |
    'underline';

export declare type ForegroundColors =
    'black' |
    'blue' |
    'cyan' |
    'gray' |
    'green' |
    'magenta' |
    'red' |
    'white' |
    'yellow';

export declare type BackgroundColors =
    'bgBlack' |
    'bgBlue' |
    'bgCyan' |
    'bgGray' |
    'bgGreen' |
    'bgMagenta' |
    'bgRed' |
    'bgWhite' |
    'bgYellow';

/**
 * Class that represents the environment name.
 */
export declare class EnvironmentName {
    /**
     * The development environment name.
     */
    public static readonly development: string;

    /**
     * The production environment name.
     */
    public static readonly production: string;

    /**
     * The testing environment name.
     */
    public static readonly test: string;

    /**
     * The staging environment name.
     */
    public static readonly staging: string;
}

/**
 * Represents the application's environment.
 */
export declare class Environment {
    /**
     * gets or sets the name of the environment.
     */
    public name: string;

    /**
     * Indicates if the environment is development.
     * @returns {boolean} True if the environment is development, otherwise false.
     */
    public get isDevelopment(): boolean;

    /**
     * Indicates if the environment is production.
     * @returns {boolean} True if the environment is production, otherwise false.
     */
    public get isProduction(): boolean;

    /**
     * Indicates if the environment is for testing.
     * @returns {boolean} True if the environment is for testing, otherwise false.
     */
    public get isTest(): boolean;

    /**
     * Indicates if the environment is staging.
     * @returns {boolean} True if the environment is staging, otherwise false.
     */
    public get isStaging(): boolean;
}

/**
 * Represents the project type.
 */
export enum ProjectType {
    /**
     * API project.
     */
    API = "API",
    /**
     * Views project.
     */
    Views = "Views"
}

//#endregion

//#region Services

/**
 * Service for handling console.
 */
export declare class Console {
    /**
     * Parses console arguments into an array of ConsoleArgument objects.
     * @param {string[]} args - The arguments to parse.
     * @returns {ConsoleArgument[]} An array of parsed console arguments.
     */
    public static parseArguments(args: string[]): ConsoleArgument[];

    /**
     * Parses console arguments into TypeScript compiler options.
     * @param {ConsoleArgument[]} args - The arguments to parse.
     * @returns {typescript.CompilerOptions} The parsed TypeScript compiler options.
     */
    public static parseTypescriptArguments(args: ConsoleArgument[]): typescript.CompilerOptions;

    /**
     * Writes a message to the console, in red color, and moves to the next line.
     * @param {any} message - The message to write.
     * @param {...any} messages - Additional messages to write.
     * @returns {void}
     */
    public static writeLineError(message: any, ...messages: any[]): void;

    /**
     * Writes a message to the console, in yellow color, and moves to the next line.
     * @param {any} message - The message to write.
     * @param {...any} messages - Additional messages to write.
     * @returns {void}
     */
    public static writeLineWarning(message: any, ...messages: any[]): void;

    /**
     * Writes a message to the console, in blue color, and moves to the next line.
     * @param {any} message - The message to write.
     * @param {...any} messages - Additional messages to write.
     * @returns {void}
     */
    public static writeLineInfo(message: any, ...messages: any[]): void;

    /**
     * Writes a message to the console, in green color, and moves to the next line.
     * @param {any} message - The message to write.
     * @param {...any} messages - Additional messages to write.
     * @returns {void}
     */
    public static writeLineSuccess(message: any, ...messages: any[]): void;
    /**
     * Writes a message to the console and moves to the next line.
     * @param {any} message - The message to write.
     * @param {...any} messages - Additional messages to write.
     */
    public static writeLine(message: any, ...messages: any[]): void;

    /**
     * Writes a formatted message to the console and moves to the next line.
     * @param {ConsoleMessage} message - The message to write.
     * @param {...ConsoleMessage} messages - Additional messages to write.
     */
    public static writeLineFormatted(message: ConsoleMessage, ...messages: ConsoleMessage[]): void;

    /**
     * Removes the last line from the console.
     */
    public static removeLastLine(): void;

    /**
     * Sets the output function for the console.
     * @param {(...args: any[]) => void} writer - The function to set as the output.
     */
    public static setOutput(writer: (...args: any[]) => void): void;

    /**
     * Resets the output function to the default console log.
     * @returns {void}
     */
    public static resetOutput(): void;
}

/**
 * A utility class for throwing exceptions.
 */
export declare class Throw {
    /**
     * Throws an error if the value is null.
     * @param {any} value - The value to check.
     * @throws {NullReferenceException} When the value is null.
     */
    public static ifNull(value: any): void;

    /**
     * Throws an error if the value is null or undefined.
     * @param {any} value - The value to check.
     * @throws {NullReferenceException} When the value is null or undefined.
     */
    public static ifNullOrUndefined(value: any): void;

    /**
     * Throws an error if the string is null or empty.
     * @param {string | null | undefined} value - The string to check.
     * @throws {NullReferenceException} When the string is null or empty.
     */
    public static ifNullOrEmpty(value: string | null | undefined): void;

    /**
     * Throws an error if the string is null or contains only empty spaces.
     * @param {string | null | undefined} value - The string to check.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static ifNullOrWhitespace(value: string | null | undefined): void;
}

/**
 * A service for handling version information.
 */
export declare class VersionService {
    /**
     * Displays the version information.
     */
    public static display(): void;

    /**
     * Retrieves the version information.
     * @returns {string} The version string.
     */
    public static get(): string;
}

/**
 * Returns the name of a property as a string.
 *
 * This utility supports two forms:
 * - Passing a string literal that matches a key of the specified type.
 * - Passing a lambda expression that accesses a property.
 *
 * @example
 * nameof<Person>("firstName");               // "firstName"
 * nameof(() => person.age);                  // "age"
 *
 * @template T The target type whose key or property is being referenced.
 * @param expr A string literal of a key in type T, or a lambda accessing a property.
 * @returns The extracted property name.
 * @throws {InvalidExpressionException} If the lambda expression is invalid or cannot be parsed.
 */
export declare function nameof<T>(expr: keyof T): string;
export declare function nameof<T>(expr: () => T): string;
export declare function nameof<T>(expr: keyof T | (() => T)): string;

//#endregion