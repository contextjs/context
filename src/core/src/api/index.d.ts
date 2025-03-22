/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

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
     * @returns {Promise<void>} A promise that resolves when the application has finished running.
     */
    public runAsync(): Promise<void>;

    /**
     * Sets the function to be executed when the application runs.
     * @param {() => Promise<any>} execute - The function to execute.
     * @returns {Application} The application instance.
     */
    public onRun(execute: () => Promise<any>): Application;
}

//#region Collections

/**
 * Represents a stack data structure.
 * @template T The type of elements in the stack.
 */
export declare class Stack<T> {
    /**
     * Pushes an element onto the stack.
     * @param t The element to push.
     */
    public push(t: T): void;

    /**
     * Pops an element off the stack.
     * @returns The popped element or null if the stack is empty.
     */
    public pop(): T | null;

    /**
     * Gets the current element on the stack without removing it.
     * 
     * @returns The current element or null if the stack is empty.
     */
    public get current(): T | null;
}

//#endregion

//#region Exceptions

/**
 * Represents an exception with a custom message.
 */
export declare class Exception extends Error {
    /**
     * Creates an instance of Exception.
     * @param {string} message - The error message.
     */
    constructor(message: string);
}

/**
 * Represents an exception that occurs when a file already exists.
 */
export declare class FileExistsException extends Exception {
    /**
     * Creates an instance of FileExistsException.
     * @param {string} file - The file that already exists.
     */
    public constructor(file: string);
}

/**
 * Represents an exception that occurs when a file is not found.
 */
export declare class FileNotFoundException extends Exception {
    /**
     * Creates an instance of FileNotFoundException.
     * @param {string} file - The file that was not found.
     */
    public constructor(file: string);
}

/**
 * Represents an exception that occurs when a null reference is encountered.
 */
export declare class NullReferenceException extends Exception { }

/**
 * Represents an exception that occurs when a path is not found.
 */
export declare class PathNotFoundException extends Exception { 
    /**
     * Creates an instance of PathNotFoundException.
     * @param {string} path - The path that was not found.
     */
    public constructor(path: string);
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
     * @returns {boolean} True if the value is null or undefined, otherwise false.
     */
    public static isNullOrUndefined(value: any): boolean;

    /**
     * Checks if the given value is null.
     * @param {any} value - The value to check.
     * @returns {boolean} True if the value is null, otherwise false.
     */
    public static isNull(value: any): boolean;

    /**
     * Checks if the given value is undefined.
     * @param {any} value - The value to check.
     * @returns {boolean} True if the value is undefined, otherwise false.
     */
    public static isUndefined(value: any): boolean;
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
     * Checks if the given string is null or empty.
     * @param {string | null | undefined} value - The string to check.
     * @returns {boolean} True if the string is null or empty, otherwise false.
     */
    public static isNullOrEmpty(value: string | null | undefined): boolean;

    /**
     * Checks if the given value is null or undefined.
     * @param {string | null | undefined} value - The value to check.
     * @returns {boolean} True if the value is null or undefined, otherwise false.
     */
    public static isNullOrUndefined(value: string | null | undefined): boolean;

    /**
     * Checks if the given string is null or contains only whitespaces.
     * @param {string | null | undefined} value - The string to check.
     * @returns {boolean} True if the string is null or white space, otherwise false.
     */
    public static isNullOrWhiteSpace(value: string | null | undefined): boolean;

    /**
     * Removes all white spaces from the given string.
     * @param {string} value - The string to process.
     * @returns {string} The string without white spaces.
     */
    public static removeWhiteSpaces(value: string): string;

    /**
     * Checks if a character is a line break.
     * @param value The character to check.
     * @returns True if the character is a line break; otherwise, false.
     */
    public static isLineBreak(value: string): boolean;

    /**
     * Checks if a character is a digit (0-9).
     * @param character The character to check.
     * @returns True if the character is a digit; otherwise, false.
     */
    public static isDigit(character: string): boolean;

    /**
     * Checks if a character is a letter from any language (Unicode letters).
     * @param character The character to check.
     * @returns True if the character is a letter from any language; otherwise, false.
     */
    public static isLetter(character: string): boolean;

    /**
     * Checks if a character is letter or digit.
     * @param value The character to check.
     * @returns True if the character is letter or digit; otherwise, false.
     */
    public static isLetterOrDigit(value: string): boolean;

    /**
     * Checks if a character is a whitespace character.
     * @param value The character to check.
     * @returns True if the character is a whitespace character; otherwise, false.
     */
    public static isWhitespace(value: string): boolean;

    /**
     * Formats a string with the given arguments.
     * @param template The string template.
     * @param args The arguments to format the string.
     * @returns The formatted string.
     */
    public static format(template: string, ...args: any[]): string;
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
}

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
    API
}

//#endregion

//#region Services

/**
 * Service for handling console.
 */
export declare class ConsoleService {
    /**
     * Parses console arguments into an array of ConsoleArgument objects.
     * @param {string[]} args - The arguments to parse.
     * @returns {ConsoleArgument[]} An array of parsed console arguments.
     */
    public static parseArguments(args: string[]): ConsoleArgument[];

    /**
     * Writes a message to the console.
     * @param {string} message - The message to write.
     */
    public static write(message: string): void;

    /**
     * Removes the last line from the console.
     */
    public static removeLastLine(): void;
}

/**
 * A class for path system operations.
 */
export declare class PathService {
    /**
     * Reads the contents of a file as a string.
     * @param {string} filePath - The path of the file to read.
     * @returns {string} The content of the file.
     * @throws {FileNotFoundException} The file was not found.
     */
    public static fileRead(filePath: string): string;

    /**
     * Saves content to a file.
     * @param {string} filePath - The path of the file to save to.
     * @param {string} content - The content to write to the file.
     * @param {boolean} [overwrite] - Whether to overwrite the file if it exists. Default is false.
     * @returns {boolean} True if the file was saved, otherwise false.
     * @throws {FileExistsException} The file already exists and overwrite is false.
     * @throws {NullReferenceException} The path is null or empty.
     */
    public static fileSave(filePath: string, content: string, overwrite?: boolean): boolean;

    /**
     * Deletes a file.
     * @param {string} filePath - The path of the file to delete.
     * @returns {boolean} True if the file was deleted, otherwise false.
     * @throws {NullReferenceException} The path is null or empty.
     */
    public static fileDelete(filePath: string): boolean;

    /**
     * Deletes a directory.
     * @param {string} directoryPath - The path of the directory to delete.
     * @returns {boolean} True if the directory was deleted, otherwise false.
     * @throws {NullReferenceException} The path is null or empty.
     */
    public static directoryDelete(directoryPath: string): boolean;

    /**
     * Checks if a path exists.
     * @param {string} path - The path to check.
     * @returns {boolean} True if the path exists, otherwise false.
     */
    public static exists(path: string): boolean;

    /**
     * Checks if a path is a file.
     * @param {string} path - The path to check.
     * @returns {boolean} True if the path is a file, otherwise false.
     */
    public static isFile(path: string): boolean;

    /**
     * Checks if a path is a directory.
     * @param {string} path - The path to check.
     * @returns {boolean} True if the path is a directory, otherwise false.
     */
    public static isDirectory(path: string): boolean;

    /**
     * Creates a directory.
     * @param {string} path - The path of the directory to create.
     * @returns {boolean} True if the directory was created, otherwise false.
     * @throws {NullReferenceException} The path is null or empty.
     */
    public static directoryCreate(path: string): boolean;

    /**
     * Checks if a directory is empty.
     * @param {string} path - The path of the directory to check.
     * @returns {boolean} True if the directory is empty, otherwise false.
     * @throws {PathNotFoundException} The path is null or empty.
     */
    public static directoryIsEmpty(path: string): boolean;
}

/**
 * A service for handling project types.
 */
export declare class ProjectTypeService {
    /**
     * Converts a project type to a string.
     * @param {ProjectType} projectType - The project type to convert.
     * @returns {string | null} The string representation of the project type or null if the project type is not recognized.
     */
    public static toString(projectType: ProjectType): string | null;

    /**
     * Converts a string to a project type.
     * @param {string} value - The string to convert.
     * @returns {ProjectType | null} The project type or null if the string is not recognized.
     */
    public static fromString(value: string): ProjectType | null;

    /**
     * Converts a number to a project type.
     * @param {number} value - The number to convert.
     * @returns {ProjectType | null} The project type or null if the number is not recognized.
     */
    public static fromNumber(value: number): ProjectType | null;

    /**
     * Converts project types to CLI options.
     * @returns {string[]} An array of CLI options.
     */
    public static toCLIOptions(): string[];
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
    public static ifNullOrWhiteSpace(value: string | null | undefined): void;
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

//#endregion