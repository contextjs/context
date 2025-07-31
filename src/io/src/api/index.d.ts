/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

//#region Exceptions

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