# @contextjs/system

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/system?cache=300)](https://www.npmjs.com/package/@contextjs/system)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> A zero-dependency system utility library for the ContextJS ecosystem, providing application lifecycle, environment detection, console formatting, exception handling, property extraction (`nameof()`), and core extensions — all written with full type safety.

## Features

- **Application lifecycle management** with `onRun()` hooks
- **Environment detection** with development/production/test/staging support
- **Console formatting** with ANSI styles and argument parsing
- **Typed exceptions** like `NullReferenceException` and `InvalidExpressionException`
- **Safe property extraction** via `nameof()` for both lambdas and keys
- **Core helpers** for object and string manipulation with type guards
- **Type-safe utility `Throw` guard methods**
- **Fully tested**, 100% coverage, no dependencies

## Installation

```bash
npm i @contextjs/system
```

## Quick Start

### 1. Run an application

```typescript
import { Application } from '@contextjs/system';

const app = new Application();

app.onRun(async () => {
    console.log("App booted");
});

await app.runAsync();
```

### 2. nameof() Example

```typescript
import { Application, nameof } from '@contextjs/system';

const app = new Application();

class User {
    name: string = 'John Doe';
    age: number = 30;
}

class Config {
    port: number = 3000;
    host: string = 'localhost';
}

const user = new User();

const property = nameof(() => user.name); // "name"
const key = nameof<Config>('port');       // "port"

app.onRun(async () => {
    console.log("App is running");
    console.log(`User name: ${user.name}`);
    console.log(`User age: ${user.age}`);
});

await app.runAsync();
```
## Console Formatting

```typescript
import { Console } from "@contextjs/system";

Console.writeLineSuccess('✔ Success');
Console.writeLineWarning('⚠ Warning');
Console.writeLineError('✖ Error');
Console.writeLineInfo('ℹ Info');

Console.writeLineFormatted({ format: ['bold', 'green'], text: 'Styled' });
```

## Common Utilities

### Guard with `Throw`

```typescript
import { Application, StringExtensions, Throw } from "@contextjs/system";

const name = StringExtensions.empty;
const configPath = "config.json";
const obj = { key: "value" };

const app = new Application();

app.onRun(async () => {
    Throw.ifNullOrWhiteSpace(name);
    Throw.ifNullOrEmpty(configPath);
    Throw.ifNull(obj);
});

await app.runAsync();
```

### Use string helpers

```typescript
import { StringExtensions } from "@contextjs/system";

const value = "a b c ";

StringExtensions.removeWhiteSpaces(value);
console.log(StringExtensions.isNullOrWhiteSpace(value));
```

### Check object null state

```typescript
import { ObjectExtensions } from "@contextjs/system";

const value: string = "Hello, World!";

if (!ObjectExtensions.isNullOrUndefined(value)) {
    // TypeScript will narrow the type
    console.log(value);
}
```

## Testing

This library is fully covered with unit tests using Node's native `test` module.

Test coverage includes:
- Environment parsing
- Console formatting
- String/object helpers
- Exception and guard behavior
- Version display
- Application lifecycle execution
- Property name extraction via `nameof()`

## Philosophy

@contextjs/system is built to be the minimal core foundation for higher-level libraries in the ContextJS ecosystem.
It provides safe, strongly-typed primitives that you can rely on without reflection, decorators, or external dependencies.

## API Reference

### Application

```typescript
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
```

### Extensions

```typescript
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
     * Represents a new line, platform-specific.
     */
    public static readonly newLine: string;

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
```

### Models

```typescript
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
    'grey' |
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
    API
}
```

### Services

```typescript
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
```

### Exceptions

```typescript
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
```