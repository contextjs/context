/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { FileExistsException } from "../exceptions/file-exists.exception.mjs";
import { FileNotFoundException } from "../exceptions/file-not-found.exception.mjs";
import { Throw } from "./throw.service.mjs";

export class PathService {
    public static fileRead(filePath: string): string | null {
        try {
            if (existsSync(filePath))
                return readFileSync(filePath, 'utf8');

            throw new FileNotFoundException(filePath);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    public static fileSave(filePath: string, content: string, overwrite: boolean = false): boolean {
        try {
            Throw.ifNullOrWhiteSpace(filePath);

            if (!overwrite && existsSync(filePath))
                throw new FileExistsException(filePath);

            const dirname = path.dirname(filePath);
            if (!existsSync(dirname))
                mkdirSync(dirname, { recursive: true });

            writeFileSync(filePath, content, 'utf8');
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    public static fileDelete(filePath: string): boolean {
        try {
            Throw.ifNullOrWhiteSpace(filePath);

            if (existsSync(filePath)) {
                unlinkSync(filePath);
                return true;
            }

            return false;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    public static directoryDelete(directoryPath: string): boolean {
        try {
            Throw.ifNullOrWhiteSpace(directoryPath);

            if (!existsSync(directoryPath))
                return true;

            rmSync(directoryPath, { recursive: true });

            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    public static exists(path: string): boolean {
        return existsSync(path);
    }

    public static isFile(path: string): boolean {
        return existsSync(path) && lstatSync(path).isFile();
    }

    public static isDirectory(path: string): boolean {
        return existsSync(path) && lstatSync(path).isDirectory();
    }

    public static directoryCreate(path: string): boolean {
        Throw.ifNullOrWhiteSpace(path);

        if (!existsSync(path)) {
            mkdirSync(path);
            return true;
        }

        return false;
    }
}