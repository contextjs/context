/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { NullReferenceException } from "@contextjs/system";
import { copyFileSync, promises as fsp, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { FileExistsException } from "../exceptions/file-exists.exception.js";
import { FileNotFoundException } from "../exceptions/file-not-found.exception.js";
import { UnsupportedPathOperationException } from "../exceptions/unsupported-path-operation.exception.js";
import { FilePathOperation } from "../models/file-path-operation.js";
import { PathOperationType } from "../models/path-operation-type.js";
import { Directory } from "./directory.js";
import { Path } from "./path.js";

export class File {
    public static read(file: string): string {
        if (Path.isFile(file))
            return readFileSync(file, 'utf8');

        throw new FileNotFoundException(file);
    }

    public static async readAsync(file: string): Promise<string> {
        if (await Path.isFileAsync(file))
            return await fsp.readFile(file, 'utf8');

        throw new FileNotFoundException(file);
    }

    public static save(file: string, content: string, overwrite: boolean = false): boolean {
        NullReferenceException.throwIfNullOrWhitespace(file);

        if (!overwrite && Path.isFile(file))
            throw new FileExistsException(file);

        const dirname = path.dirname(file);
        if (!Directory.exists(dirname))
            Directory.create(dirname);

        writeFileSync(file, content, 'utf8');

        return true;
    }

    public static async saveAsync(file: string, content: string, overwrite: boolean = false): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(file);

        if (!overwrite && await Path.isFileAsync(file))
            throw new FileExistsException(file);

        const dirname = path.dirname(file);
        if (!await Directory.existsAsync(dirname))
            await Directory.createAsync(dirname);

        await fsp.writeFile(file, content, 'utf8');

        return true;
    }

    public static rename(oldFile: string, newFile: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(oldFile);
        NullReferenceException.throwIfNullOrWhitespace(newFile);

        if (!this.exists(oldFile))
            throw new FileNotFoundException(oldFile);

        if (this.exists(newFile))
            throw new FileExistsException(newFile);

        renameSync(oldFile, newFile);

        return true;
    }

    public static async renameAsync(oldFile: string, newFile: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(oldFile);
        NullReferenceException.throwIfNullOrWhitespace(newFile);

        if (!await this.existsAsync(oldFile))
            throw new FileNotFoundException(oldFile);

        if (await this.existsAsync(newFile))
            throw new FileExistsException(newFile);

        await fsp.rename(oldFile, newFile);

        return true;
    }

    public static delete(file: string): boolean {
        NullReferenceException.throwIfNullOrWhitespace(file);

        if (this.exists(file)) {
            rmSync(file);
            return true;
        }

        return false;
    }

    public static async deleteAsync(file: string): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(file);

        if (await this.existsAsync(file)) {
            await fsp.rm(file);
            return true;
        }

        return false;
    }

    public static copy(source: string, target: string, overwrite: boolean = false): boolean {
        NullReferenceException.throwIfNullOrWhitespace(source);
        NullReferenceException.throwIfNullOrWhitespace(target);

        if (!this.exists(source))
            throw new FileNotFoundException(source);

        if (this.exists(target) && !overwrite)
            throw new FileExistsException(target);

        const dirname = path.dirname(target);
        if (!Directory.exists(dirname))
            Directory.create(dirname);

        copyFileSync(source, target);

        return true;
    }

    public static async copyAsync(source: string, target: string, overwrite: boolean = false): Promise<boolean> {
        NullReferenceException.throwIfNullOrWhitespace(source);
        NullReferenceException.throwIfNullOrWhitespace(target);

        if (!await this.existsAsync(source))
            throw new FileNotFoundException(source);

        if (await this.existsAsync(target) && !overwrite)
            throw new FileExistsException(target);

        const dirname = path.dirname(target);
        if (!await Directory.existsAsync(dirname))
            await Directory.createAsync(dirname);

        await fsp.copyFile(source, target);

        return true;
    }

    public static exists(file: string): boolean {
        return Path.isFile(file);
    }

    public static async existsAsync(file: string): Promise<boolean> {
        return await Path.isFileAsync(file);
    }

    public static getName(file: string, withExtension: boolean = true): string | null {
        NullReferenceException.throwIfNullOrWhitespace(file);

        return withExtension
            ? path.basename(file)
            : path.basename(file, path.extname(file));
    }

    public static getDirectory(file: string): string | null {
        NullReferenceException.throwIfNullOrWhitespace(file);

        return path.dirname(file);
    }

    public static getExtension(file: string): string | null {
        NullReferenceException.throwIfNullOrWhitespace(file);
        const normalizedPath = Path.normalize(file);

        return path.extname(normalizedPath).slice(1).toLowerCase();
    }

    public static processOperation(entry: FilePathOperation, overwrite: boolean = false): boolean {
        switch (entry.type) {
            case PathOperationType.Copy:
                return File.copy(entry.source, entry.destination, overwrite);
            case PathOperationType.Move:
                return File.rename(entry.source, entry.destination);
            default:
                throw new UnsupportedPathOperationException(entry.type);
        }
    }

    public static async processOperationAsync(entry: FilePathOperation, overwrite: boolean = false): Promise<boolean> {
        switch (entry.type) {
            case PathOperationType.Copy:
                return await File.copyAsync(entry.source, entry.destination, overwrite);
            case PathOperationType.Move:
                return await File.renameAsync(entry.source, entry.destination);
            default:
                throw new UnsupportedPathOperationException(entry.type);
        }
    }

    public static processOperations(entries: FilePathOperation[], overwrite: boolean = false): void {
        if (!Array.isArray(entries))
            throw new NullReferenceException("entries must be an array");

        if (entries.length === 0)
            return;

        for (const entry of entries)
            File.processOperation(entry, overwrite);
    }

    public static async processOperationsAsync(entries: FilePathOperation[], overwrite: boolean = false): Promise<void> {
        if (!Array.isArray(entries))
            throw new NullReferenceException("entries must be an array");

        if (entries.length === 0)
            return;

        for (const entry of entries)
            await File.processOperationAsync(entry, overwrite);
    }
}