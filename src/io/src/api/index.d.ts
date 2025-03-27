/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/core";

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
     * Deletes a directory.
     * @param directory The directory to delete.
     * @returns true if the directory was deleted; otherwise, false.
     * @throws {NullReferenceException} When the string is null or contains only empty spaces.
     */
    public static delete(directory: string): boolean;

    /**
     * Determines whether the specified directory exists.
     * @param directory The directory to check.
     * @returns true if the directory exists; otherwise, false.
     * @throws {NullReferenceException} When the directory string is null or contains only empty spaces.
     */
    public static exists(directory: string): boolean;

    /**
     * Determines whether the specified directory is empty.
     * @param directory The directory to check.
     * @returns true if the directory is empty; otherwise, false.
     * @throws {PathNotFoundException} When the directory does not exist or is not a directory.
     */
    public static isEmpty(directory: string): boolean;
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
    public static read(file: string): string | null;

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
     * Deletes a file.
     * @param file The file to delete.
     * @returns true if the file was deleted; otherwise, false.
     * @throws {NullReferenceException} When the file string is null or contains only empty spaces.
     */
    public static delete(file: string): boolean;

    /**
     * Determines whether the specified file exists.
     * @param file The file to check.
     * @returns true if the file exists; otherwise, false.
     */
    public static exists(file: string): boolean;
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
     * Determines whether the specified path is a directory.
     * @param path The path to check.
     * @returns true if the path is a directory; otherwise, false.
     */
    public static isDirectory(path: string): boolean;

    /**
     * Determines whether the specified path is a file.
     * @param path The path to check.
     * @returns true if the path is a file; otherwise, false.
     */
    public static isFile(path: string): boolean;
}

//#endregion