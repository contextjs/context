# @contextjs/io

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/io)](https://www.npmjs.com/package/@contextjs/io)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Contains functionality that allow reading and writing to files, and classes that provide path, files and directories support.

### Installation

```
npm install @contextjs/io
```

### Directory
static methods for creating, renaming and deleting directories and subdirectories.

```ts
/**
 * Creates a directory.
 * @param directory The directory to create.
 * @returns true if the directory was created; otherwise, false.
 * @throws {NullReferenceException} When the string is null or contains only empty spaces.
 */
public static create(directory: string): boolean;

```

```ts
/**
 * Renames a directory.
 * @param oldDirectory The old directory name.
 * @param newDirectory The new directory name.
 * @returns true if the directory was renamed; otherwise, false.
 * @throws {NullReferenceException} When the oldDirectory is null or contains only empty spaces.
 * @throws {NullReferenceException} When the newDirectory is null or contains only empty spaces.
 * @throws {PathNotFoundException} When the oldDirectory does not exist.
 * @throws {DirectoryExistsException} When the newDirectory already exists.
 */
public static rename(oldDirectory: string, newDirectory: string): boolean;
```

```ts
/**
 * Deletes a directory.
 * @param directory The directory to delete.
 * @returns true if the directory was deleted; otherwise, false.
 * @throws {NullReferenceException} When the string is null or contains only empty spaces.
 */
public static delete(directory: string): boolean;
```

```ts
/**
 * Determines whether the specified directory exists.
 * @param directory The directory to check.
 * @returns true if the directory exists; otherwise, false.
 * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
 */
public static exists(directory: string): boolean;
```

```ts
/**
 * Determines whether the specified directory is empty.
 * @param directory The directory to check.
 * @returns true if the directory is empty; otherwise, false.
 * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
 */
public static isEmpty(directory: string): boolean;
```  


### File 
static methods for creating, renaming, editing and deleting files.

```ts
/**
 * Reads the contents of a file.
 * @param file The file to read.
 * @returns The contents of the file.
 * @throws {FileNotFoundException} When the file does not exist.
 */
public static read(file: string): string | null;
```

```ts
/**
 * Saves content to a file.
 * @param file The file to save to.
 * @param content The content to save.
 * @returns true if the file was saved; otherwise, false.
 * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
 * @throws {FileExistsException} When the file already exists.
 */
public static save(file: string, content: string): boolean;
```

```ts
/**
 * Saves content to a file.
 * @param file The file to save to.
 * @param content The content to save.
 * @param overwrite true to overwrite the file; otherwise, false.
 * @returns true if the file was saved; otherwise, false.
 * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
 * @throws {FileExistsException} When the file already exists and overwrite is false.
 */
public static save(file: string, content: string, overwrite: boolean): boolean;
```

```ts
/**
 * Renames a file.
 * @param oldFile The old file name.
 * @param newFile The new file name.
 * @returns true if the file was renamed; otherwise, false.
 * @throws {NullReferenceException} When the oldFile is null or contains only empty spaces.
 * @throws {NullReferenceException} When the newFile is null or contains only empty spaces.
 * @throws {FileNotFoundException} When the oldFile does not exist.
 * @throws {FileExistsException} When the newFile already exists.
 */
public static rename(oldFile: string, newFile: string): boolean;
```

```ts
/**
 * Deletes a file.
 * @param file The file to delete.
 * @returns true if the file was deleted; otherwise, false.
 * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
 */
public static delete(file: string): boolean;
```

```ts
/**
 * Determines whether the specified file exists.
 * @param file The file to check.
 * @returns true if the file exists; otherwise, false.
 */
public static exists(file: string): boolean;
```


### Path
static methods regarding file or directory path information

```ts
/**
 * Determines whether the specified path exists.
 * @param path The path to check.
 * @returns true if the path exists; otherwise, false.
 */
public static exists(path: string): boolean;
```

```ts
/**
 * Determines whether the specified path is a directory.
 * @param path The path to check.
 * @returns true if the path is a directory; otherwise, false.
 */
public static isDirectory(path: string): boolean;
```

```ts
/**
 * Determines whether the specified path is a file.
 * @param path The path to check.
 * @returns true if the path is a file; otherwise, false.
 */
public static isFile(path: string): boolean;
```

### Exceptions

```ts
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
```

```ts
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
```

```ts
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
```