/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from "@contextjs/system";
import { cpSync, promises as fsp, mkdirSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { DirectoryExistsException } from "../exceptions/directory-exists.exception.js";
import { PathNotFoundException } from "../exceptions/path-not-found.exception.js";
import { UnsupportedPathOperationException } from "../exceptions/unsupported-path-operation.exception.js";
import { DirectoryPathOperation } from "../models/directory-path-operation.js";
import { PathOperationType } from "../models/path-operation-type.js";
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

    public static copy(source: string, destination: string, overwrite: boolean = true): boolean {
        NullReferenceException.throwIfNullOrWhitespace(source);
        NullReferenceException.throwIfNullOrWhitespace(destination);

        if (!Directory.exists(source))
            throw new PathNotFoundException(source);

        cpSync(source, destination, { recursive: true, force: overwrite });

        return true;
    }

    public static async copyAsync(source: string, destination: string, overwrite: boolean = true): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(source);
        NullReferenceException.throwIfNullOrWhitespace(destination);

        if (!await Directory.existsAsync(source))
            throw new PathNotFoundException(source);

        await fsp.cp(source, destination, { recursive: true, force: overwrite });

        return true;
    }

    public static processOperation(entry: DirectoryPathOperation, overwrite: boolean = true): boolean {
        switch (entry.type) {
            case PathOperationType.Copy:
                return Directory.copy(entry.source, entry.destination, overwrite);
            case PathOperationType.Move:
                return Directory.rename(entry.source, entry.destination);
            default:
                throw new UnsupportedPathOperationException(entry.type);
        }
    }

    public static async processOperationAsync(entry: DirectoryPathOperation, overwrite: boolean = true): Promise<boolean> {
        switch (entry.type) {
            case PathOperationType.Copy:
                return await Directory.copyAsync(entry.source, entry.destination, overwrite);
            case PathOperationType.Move:
                return await Directory.renameAsync(entry.source, entry.destination);
            default:
                throw new UnsupportedPathOperationException(entry.type);
        }
    }

    public static processOperations(entries: DirectoryPathOperation[], overwrite: boolean = true): void {
        if (!Array.isArray(entries))
            throw new NullReferenceException("entries must be an array");

        if (entries.length === 0)
            return;

        for (const entry of entries)
            Directory.processOperation(entry, overwrite);
    }

    public static async processOperationsAsync(entries: DirectoryPathOperation[], overwrite: boolean = true): Promise<void> {
        if (!Array.isArray(entries))
            throw new NullReferenceException("entries must be an array");

        if (entries.length === 0)
            return;

        for (const entry of entries)
            await Directory.processOperationAsync(entry, overwrite);
    }
}