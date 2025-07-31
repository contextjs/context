/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from "@contextjs/system";
import fs from "node:fs";
import * as nodePath from 'node:path';
import { PathNotFoundException } from "../exceptions/path-not-found.exception.js";

export class Path {
    public static exists(path: string): boolean {
        try {
            fs.accessSync(path);
            return true;
        }
        catch {
            return false;
        }
    }

    public static async existsAsync(path: string): Promise<boolean> {
        try {
            await fs.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }

    public static isDirectory(path: string): boolean {
        try {
            return fs.statSync(path).isDirectory();
        }
        catch {
            return false;
        }
    }

    public static async isDirectoryAsync(path: string): Promise<boolean> {
        try {
            const stats = await fs.promises.stat(path);
            return stats.isDirectory();
        }
        catch {
            return false;
        }
    }

    public static isFile(path: string): boolean {
        try {
            return fs.statSync(path).isFile();
        }
        catch {
            return false;
        }
    }

    public static async isFileAsync(path: string): Promise<boolean> {
        try {
            const stats = await fs.promises.stat(path);
            return stats.isFile();
        }
        catch {
            return false;
        }
    }

    public static normalize(path: string): string {
        NullReferenceException.throwIfNullOrWhitespace(path);
        return nodePath.normalize(path).replace(/^(\.\.[\/\\])+/, '');
    }

    public static join(...paths: string[]): string {
        return nodePath.join(...paths.map(p => Path.normalize(p)));
    }

    public static listDirectories(directory: string): string[] {
        NullReferenceException.throwIfNullOrWhitespace(directory);
        if (!Path.isDirectory(directory))
            throw new PathNotFoundException(`The directory "${directory}" does not exist or is not a directory.`);

        return fs.readdirSync(directory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    public static async listDirectoriesAsync(directory: string): Promise<string[]> {
        NullReferenceException.throwIfNullOrWhitespace(directory);
        if (!await Path.isDirectoryAsync(directory))
            throw new PathNotFoundException(`The directory "${directory}" does not exist or is not a directory.`);

        const dirents = await fs.promises.readdir(directory, { withFileTypes: true });
        return dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }

    public static resolve(...paths: string[]): string {
        paths.forEach(NullReferenceException.throwIfNullOrWhitespace);
        return nodePath.resolve(...paths);
    }
}