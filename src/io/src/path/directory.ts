/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from "@contextjs/system";
import { mkdirSync, readdirSync, renameSync, rmSync, statSync, promises as fsp } from "node:fs";
import path from "node:path";
import { DirectoryExistsException } from "../exceptions/directory-exists.exception.js";
import { PathNotFoundException } from "../exceptions/path-not-found.exception.js";
import { Path } from "./path.js";

export class Directory {
    public static create(directory: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(directory);

        if (Path.exists(directory))
            return false;

        mkdirSync(directory, { recursive: true });
        return true;
    }

    public static async createAsync(directory: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(directory);

        if (await Path.existsAsync(directory))
            return false;

        await fsp.mkdir(directory, { recursive: true });
        return true;
    }

    public static rename(oldDirectory: string, newDirectory: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(oldDirectory);
        NullReferenceException.throwIfNullOrWhitespace(newDirectory);

        if (!Directory.exists(oldDirectory))
            throw new PathNotFoundException(oldDirectory);

        if (Path.exists(newDirectory))
            throw new DirectoryExistsException(newDirectory);

        renameSync(oldDirectory, newDirectory);
        return true;
    }

    public static async renameAsync(oldDirectory: string, newDirectory: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(oldDirectory);
        NullReferenceException.throwIfNullOrWhitespace(newDirectory);

        if (!await Directory.existsAsync(oldDirectory))
            throw new PathNotFoundException(oldDirectory);

        if (await Path.existsAsync(newDirectory))
            throw new DirectoryExistsException(newDirectory);

        await fsp.rename(oldDirectory, newDirectory);
        return true;
    }

    public static delete(directory: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(directory);

        if (!Path.exists(directory))
            return true;

        rmSync(directory, { recursive: true, force: true });
        return true;
    }

    public static async deleteAsync(directory: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(directory);

        if (!await Path.existsAsync(directory))
            return true;

        await fsp.rm(directory, { recursive: true, force: true });
        return true;
    }

    public static exists(directory: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(directory);
        return Path.isDirectory(directory);
    }

    public static async existsAsync(directory: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(directory);
        return await Path.isDirectoryAsync(directory);
    }

    public static isEmpty(directory: string): boolean {
        if (!Path.isDirectory(directory))
            throw new PathNotFoundException(directory);

        return readdirSync(directory).length === 0;
    }

    public static async isEmptyAsync(directory: string): Promise<boolean> {
        if (!await Path.isDirectoryAsync(directory))
            throw new PathNotFoundException(directory);

        const entries = await fsp.readdir(directory);
        return entries.length === 0;
    }

    public static listFiles(directory: string, recursive: boolean = false): string[] {
        if (!Path.isDirectory(directory))
            throw new PathNotFoundException(directory);

        const result: string[] = [];

        for (const entry of readdirSync(directory)) {
            const fullPath = path.join(directory, entry);
            const stat = statSync(fullPath);

            if (stat.isFile())
                result.push(fullPath);

            else if (stat.isDirectory() && recursive)
                result.push(...Directory.listFiles(fullPath, true));
        }

        return result;
    }

    public static async listFilesAsync(directory: string, recursive: boolean = false): Promise<string[]> {
        if (!await Path.isDirectoryAsync(directory))
            throw new PathNotFoundException(directory);

        const result: string[] = [];
        const entries = await fsp.readdir(directory);

        for (const entry of entries) {
            const fullPath = path.join(directory, entry);
            const stat = await fsp.stat(fullPath);

            if (stat.isFile())
                result.push(fullPath);

            else if (stat.isDirectory() && recursive)
                result.push(...await Directory.listFilesAsync(fullPath, true));
        }

        return result;
    }
}