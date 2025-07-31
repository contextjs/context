/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { SystemException } from "@contextjs/system";

//#region Exceptions

/**
 * Represents an exception that occurs when a file already exists.
 */
export declare class FileExistsException extends SystemException {
    /**
     * Creates an instance of FileExistsException.
     * @param {string} file - The file that already exists.
     */
    public constructor(file: string);
}

/**
 * Represents an exception that occurs when a file is not found.
 */
export declare class FileNotFoundException extends SystemException {
    /**
     * Creates an instance of FileNotFoundException.
     * @param {string} file - The file that was not found.
     */
    public constructor(file: string);
}

/**
 * Represents an exception that occurs when a path is not found.
 */
export declare class PathNotFoundException extends SystemException {
    /**
     * Creates an instance of PathNotFoundException.
     * @param {string} path - The path that was not found.
     */
    public constructor(path: string);
}

/**
 * Represents an exception that occurs when an unsupported path operation is attempted.
 */
export declare class UnsupportedPathOperationException extends SystemException {
    /**
     * Creates an instance of UnsupportedPathOperationException.
     * @param {string} operation - The unsupported path operation.
     */
    public constructor(operation: string);
}

//#endregion

//#region Models

/**
 * Represents a path operation that can be performed on a directory.
 */
export declare class DirectoryPathOperation extends PathOperation { }

/**
 * Represents a path operation that can be performed on a file.
 */
export declare class FilePathOperation extends PathOperation { }

/**
 * Represents a mapping between a source path and a destination path.
 */
export declare class PathMapping {

    /**
     * The source path.
     */
    public readonly source: string;

    /**
     * The destination path.
     */
    public readonly destination: string;

    /**
     * Creates an instance of PathMapping.
     * @param {string} source - The source path.
     * @param {string} destination - The destination path.
     */
    public constructor(source: string, destination: string);
}

/**
 * Represents the type of operation to perform on a path.
 */
export declare enum PathOperationType {
    /**
     * Copy the path.
     */
    Copy = "copy",

    /**
     * Move the path.
     */
    Move = "move"
}

/**
 * Represents a path operation that can be performed on a path.
 */
export declare class PathOperation extends PathMapping {
    /**
     * The type of operation to perform.
     */
    public readonly type: PathOperationType;

    /**
     * Creates an instance of PathOperation.
     * @param {string} source - The source path.
     * @param {string} destination - The destination path.
     * @param {PathOperationType} type - The type of operation to perform.
     */
    public constructor(source: string, destination: string, type: PathOperationType);
}

//#endregion

//#region Path

/**
 * Contains methods for working with directories.
 */
export declare class Directory {
    /**
     * Creates a directory.
     * @param directory The directory to create.
     * @returns true if the directory was created; otherwise, false.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static create(directory: string): boolean;

    /**
     * Asynchronously creates a directory.
     * @param directory The directory to create.
     * @returns Promise resolving to true if the directory was created; otherwise, false.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static createAsync(directory: string): Promise<boolean>;

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

    /**
     * Asynchronously renames a directory.
     * @param oldDirectory The old directory name.
     * @param newDirectory The new directory name.
     * @returns Promise resolving to true if the directory was renamed; otherwise, false.
     * @throws {NullReferenceException} When the oldDirectory is null or contains only empty spaces.
     * @throws {NullReferenceException} When the newDirectory is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the oldDirectory does not exist.
     * @throws {DirectoryExistsException} When the newDirectory already exists.
     */
    public static renameAsync(oldDirectory: string, newDirectory: string): Promise<boolean>;

    /**
     * Deletes a directory.
     * @param directory The directory to delete.
     * @returns true if the directory was deleted; otherwise, false.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static delete(directory: string): boolean;

    /**
     * Asynchronously deletes a directory.
     * @param directory The directory to delete.
     * @returns Promise resolving to true if the directory was deleted; otherwise, false.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static deleteAsync(directory: string): Promise<boolean>;

    /**
     * Determines whether the specified directory exists.
     * @param directory The directory to check.
     * @returns true if the directory exists; otherwise, false.
     * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
     */
    public static exists(directory: string): boolean;

    /**
     * Asynchronously determines whether the specified directory exists.
     * @param directory The directory to check.
     * @returns Promise resolving to true if the directory exists; otherwise, false.
     * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
     */
    public static existsAsync(directory: string): Promise<boolean>;

    /**
     * Determines whether the specified directory is empty.
     * @param directory The directory to check.
     * @returns true if the directory is empty; otherwise, false.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static isEmpty(directory: string): boolean;

    /**
     * Asynchronously determines whether the specified directory is empty.
     * @param directory The directory to check.
     * @returns Promise resolving to true if the directory is empty; otherwise, false.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static isEmptyAsync(directory: string): Promise<boolean>;

    /**
     * Lists the files in a directory.
     * @param directory The directory to list files from.
     * @returns An array of file paths in the directory.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static listFiles(directory: string): string[];

    /**
     * Lists the files in a directory.
     * @param directory The directory to list files from.
     * @param recursive true to list files recursively; otherwise, false.
     * @returns An array of file paths in the directory.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static listFiles(directory: string, recursive: boolean): string[];

    /**
     * Asynchronously lists the files in a directory.
     * @param directory The directory to list files from.
     * @param recursive true to list files recursively; otherwise, false.
     * @returns Promise resolving to an array of file paths in the directory.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static listFilesAsync(directory: string, recursive?: boolean): Promise<string[]>;

    /**
     * Copies a directory to a new location, Overwrite is true by default.
     * @param source The source directory path.
     * @param destination The destination directory path.
     * @returns true if the directory was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or destination string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the source directory does not exist.
     * @throws {DirectoryExistsException} When the destination directory already exists.
     */
    public static copy(source: string, destination: string): boolean;

    /**
     * Copies a directory to a new location.
     * @param source The source directory path.
     * @param destination The destination directory path.
     * @param overwrite true to overwrite the destination directory; otherwise, false.
     * @returns true if the directory was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or destination string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the source directory does not exist.
     * @throws {DirectoryExistsException} When the destination directory already exists and overwrite is false.
     */
    public static copy(source: string, destination: string, overwrite: boolean): boolean;

    /**
     * Asynchronously copies a directory to a new location. Overwrite is true by default.
     * @param source The source directory path.
     * @param destination The destination directory path.
     * @returns Promise resolving to true if the directory was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or destination string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the source directory does not exist.
     * @throws {DirectoryExistsException} When the destination directory already exists and overwrite is false.
     */
    public static copyAsync(source: string, destination: string): Promise<boolean>;

    /**
     * Asynchronously copies a directory to a new location.
     * @param source The source directory path.
     * @param destination The destination directory path.
     * @param overwrite true to overwrite the destination directory; otherwise, false.
     * @returns Promise resolving to true if the directory was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or destination string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the source directory does not exist.
     * @throws {DirectoryExistsException} When the destination directory already exists and overwrite is false.
     */
    public static copyAsync(source: string, destination: string, overwrite: boolean): Promise<boolean>;

    /**
     * Processes a directory path operation. Overwrite is true by default.
     * @param entry The directory path operation to process.
     * @returns true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperation(entry: DirectoryPathOperation): boolean;

    /**
     * Processes a directory path operation.
     * @param entry The directory path operation to process.
     * @param overwrite true to overwrite existing files/directories; otherwise, false.
     * @returns true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperation(entry: DirectoryPathOperation, overwrite: boolean): boolean;

    /**
     * Asynchronously processes a directory path operation. Overwrite is true by default.
     * @param entry The directory path operation to process.
     * @returns Promise resolving to true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperationAsync(entry: DirectoryPathOperation): Promise<boolean>;

    /**
     * Asynchronously processes a directory path operation.
     * @param entry The directory path operation to process.
     * @param overwrite true to overwrite existing files/directories; otherwise, false.
     * @returns Promise resolving to true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperationAsync(entry: DirectoryPathOperation, overwrite: boolean): Promise<boolean>;

    /**
     * Processes a batch of directory path operations. Overwrite is true by default.
     * @param entries The directory path operations to process.
     * @returns Promise resolving to true if all operations were successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperations(entries: DirectoryPathOperation[]): void;

    /**
     * Processes a batch of directory path operations.
     * @param entries The directory path operations to process.
     * @param overwrite true to overwrite existing files/directories; otherwise, false.
     * @returns void
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperations(entries: DirectoryPathOperation[], overwrite: boolean): void;

    /**
     * Asynchronously processes a batch of directory path operations. Overwrite is true by default.
     * @param entries The directory path operations to process.
     * @returns Promise resolving to true if all operations were successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperationsAsync(entries: DirectoryPathOperation[]): Promise<void>;

    /**
     * Asynchronously processes a batch of directory path operations.
     * @param entries The directory path operations to process.
     * @param overwrite true to overwrite existing files/directories; otherwise, false.
     * @returns Promise resolving to true if all operations were successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperationsAsync(entries: DirectoryPathOperation[], overwrite: boolean): Promise<void>;
}

/**
 * Contains methods for working with files.
 */
export declare class File {
    /**
     * Reads the contents of a file.
     * @param file The file to read.
     * @returns The contents of the file.
     * @throws {FileNotFoundException} When the file does not exist.
     */
    public static read(file: string): string;

    /**
     * Asynchronously reads the contents of a file.
     * @param file The file to read.
     * @returns Promise resolving to the contents of the file.
     * @throws {FileNotFoundException} When the file does not exist.
     */
    public static readAsync(file: string): Promise<string>;

    /**
     * Saves content to a file.
     * @param file The file to save to.
     * @param content The content to save.
     * @returns true if the file was saved; otherwise, false.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     * @throws {FileExistsException} When the file already exists.
     */
    public static save(file: string, content: string): boolean;

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

    /**
     * Asynchronously saves content to a file.
     * @param file The file to save to.
     * @param content The content to save.
     * @param overwrite true to overwrite the file; otherwise, false.
     * @returns Promise resolving to true if the file was saved; otherwise, false.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     * @throws {FileExistsException} When the file already exists and overwrite is false.
     */
    public static saveAsync(file: string, content: string, overwrite?: boolean): Promise<boolean>;

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

    /**
     * Asynchronously renames a file.
     * @param oldFile The old file name.
     * @param newFile The new file name.
     * @returns Promise resolving to true if the file was renamed; otherwise, false.
     * @throws {NullReferenceException} When the oldFile is null or contains only empty spaces.
     * @throws {NullReferenceException} When the newFile is null or contains only empty spaces.
     * @throws {FileNotFoundException} When the oldFile does not exist.
     * @throws {FileExistsException} When the newFile already exists.
     */
    public static renameAsync(oldFile: string, newFile: string): Promise<boolean>;

    /**
     * Deletes a file.
     * @param file The file to delete.
     * @returns true if the file was deleted; otherwise, false.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static delete(file: string): boolean;

    /**
     * Asynchronously deletes a file.
     * @param file The file to delete.
     * @returns Promise resolving to true if the file was deleted; otherwise, false.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static deleteAsync(file: string): Promise<boolean>;

    /**
     * Copies a file.
     * @param source The source file path.
     * @param target The target file path.
     * @returns true if the file was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or target string is null or contains only empty spaces.
     * @throws {FileNotFoundException} When the source file does not exist.
     * @throws {FileExistsException} When the target file already exists.
     */
    public static copy(source: string, target: string): boolean;

    /**
     * Copies a file.
     * @param source The source file path.
     * @param target The target file path.
     * @param overwrite true to overwrite the target file; otherwise, false.
     * @returns true if the file was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or target string is null or contains only empty spaces.
     * @throws {FileNotFoundException} When the source file does not exist.
     * @throws {FileExistsException} When the target file already exists and overwrite is false.
     */
    public static copy(source: string, target: string, overwrite: boolean): boolean;

    /**
     * Asynchronously copies a file.
     * @param source The source file path.
     * @param target The target file path.
     * @param overwrite true to overwrite the target file; otherwise, false.
     * @returns Promise resolving to true if the file was copied; otherwise, false.
     * @throws {NullReferenceException} When the source or target string is null or contains only empty spaces.
     * @throws {FileNotFoundException} When the source file does not exist.
     * @throws {FileExistsException} When the target file already exists and overwrite is false.
     */
    public static copyAsync(source: string, target: string, overwrite?: boolean): Promise<boolean>;

    /**
     * Determines whether the specified file exists.
     * @param file The file to check.
     * @returns true if the file exists; otherwise, false.
     */
    public static exists(file: string): boolean;

    /**
     * Asynchronously determines whether the specified file exists.
     * @param file The file to check.
     * @returns Promise resolving to true if the file exists; otherwise, false.
     */
    public static existsAsync(file: string): Promise<boolean>;

    /**
     * Gets the name of the file.
     * @param file The file to check.
     * @returns The name of the file, including extension, or null if the file does not exist.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static getName(file: string): string | null;

    /**
     * Gets the name of the file.
     * @param file The file to check.
     * @param withExtension true to include the file extension; otherwise, false.
     * @returns The name of the file, or null if the file does not exist.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static getName(file: string, withExtension: boolean): string | null;

    /**
     * Gets the directory of the file.
     * @param file The file to check.
     * @returns The directory of the file, or null if the file does not exist.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static getDirectory(file: string): string | null;

    /**
     * Gets the extension of the file.
     * @param file The file to check.
     * @returns The extension of the file, or null if the file does not exist.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static getExtension(file: string): string | null;

    /**
     * Processes a file path operation. Overwrite is true by default.
     * @param entry The file path operation to process.
     * @returns true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperation(entry: FilePathOperation): boolean;

    /**
     * Processes a file path operation.
     * @param entry The file path operation to process.
     * @param overwrite true to overwrite existing files; otherwise, false.
     * @returns true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperation(entry: FilePathOperation, overwrite: boolean): boolean;

    /**
     * Asynchronously processes a file path operation. Overwrite is true by default.
     * @param entry The file path operation to process.
     * @returns Promise resolving to true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperationAsync(entry: FilePathOperation): Promise<boolean>;

    /**
     * Asynchronously processes a file path operation.
     * @param entry The file path operation to process.
     * @param overwrite true to overwrite existing files; otherwise, false.
     * @returns Promise resolving to true if the operation was successful; otherwise, false.
     * @throws {UnsupportedPathOperationException} When the operation type is not supported.
     */
    public static processOperationAsync(entry: FilePathOperation, overwrite: boolean): Promise<boolean>;

    /**
     * Processes a batch of file path operations. Overwrite is true by default.
     * @param entries The file path operations to process.
     * @returns void
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperations(entries: FilePathOperation[]): void;

    /**
     * Processes a batch of file path operations.
     * @param entries The file path operations to process.
     * @param overwrite true to overwrite existing files; otherwise, false.
     * @returns void
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperations(entries: FilePathOperation[], overwrite: boolean): void;

    /**
     * Asynchronously processes a batch of file path operations. Overwrite is true by default.
     * @param entries The file path operations to process.
     * @returns Promise resolving to void
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperationsAsync(entries: FilePathOperation[]): Promise<void>;

    /**
     * Asynchronously processes a batch of file path operations.
     * @param entries The file path operations to process.
     * @param overwrite true to overwrite existing files; otherwise, false.
     * @returns Promise resolving to void
     * @throws {UnsupportedPathOperationException} When any operation type is not supported.
     */
    public static processOperationsAsync(entries: FilePathOperation[], overwrite: boolean): Promise<void>;
}

/**
 * Contains methods for working with paths.
 */
export declare class Path {
    /**
     * Determines whether the specified path exists.
     * @param path The path to check.
     * @returns true if the path exists; otherwise, false.
     */
    public static exists(path: string): boolean;

    /**
     * Asynchronously determines whether the specified path exists.
     * @param path The path to check.
     * @returns Promise resolving to true if the path exists; otherwise, false.
     */
    public static existsAsync(path: string): Promise<boolean>;

    /**
     * Determines whether the specified path is a directory.
     * @param path The path to check.
     * @returns true if the path is a directory; otherwise, false.
     */
    public static isDirectory(path: string): boolean;

    /**
     * Asynchronously determines whether the specified path is a directory.
     * @param path The path to check.
     * @returns Promise resolving to true if the path is a directory; otherwise, false.
     */
    public static isDirectoryAsync(path: string): Promise<boolean>;

    /**
     * Determines whether the specified path is a file.
     * @param path The path to check.
     * @returns true if the path is a file; otherwise, false.
     */
    public static isFile(path: string): boolean;

    /**
     * Asynchronously determines whether the specified path is a file.
     * @param path The path to check.
     * @returns Promise resolving to true if the path is a file; otherwise, false.
     */
    public static isFileAsync(path: string): Promise<boolean>;

    /**
     * Normalizes the specified path.
     * @param path The path to normalize.
     * @returns The normalized path.
     * @throws {NullReferenceException} When the path string is null or contains only empty spaces.
     */
    public static normalize(path: string): string;

    /**
     * Joins multiple paths into a single path.
     * @param paths The paths to join.
     * @returns The joined path.
     * @throws {NullReferenceException} When any of the path strings are null or contain only empty spaces.
     */
    public static join(...paths: string[]): string;

    /**
     * Lists the directories in a specified directory.
     * @param directory The directory to list.
     * @returns An array of directory names in the specified directory.
     * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static listDirectories(directory: string): string[];

    /**
     * Asynchronously lists the directories in a specified directory.
     * @param directory The directory to list.
     * @returns Promise resolving to an array of directory names in the specified directory.
     * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static listDirectoriesAsync(directory: string): Promise<string[]>;

    /**
     * Resolves a sequence of paths into an absolute path.
     * @param paths The paths to resolve.
     * @returns The resolved absolute path.
     * @throws {NullReferenceException} When any of the path strings are null or contain only empty spaces.
     */
    public static resolve(...paths: string[]): string;
}


//#endregion