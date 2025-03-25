/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/core";
import { readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { FileExistsException } from "../exceptions/file-exists.exception.js";
import { FileNotFoundException } from "../exceptions/file-not-found.exception.js";
import { Directory } from "./directory.js";
import { Path } from "./path.js";

export class File {
    public static read(file: string): string | null {
        if (Path.isFile(file))
            return readFileSync(file, 'utf8');

        throw new FileNotFoundException(file);
    }

    public static save(file: string, content: string, overwrite: boolean = false): boolean {
        Throw.ifNullOrWhiteSpace(file);

        if (!overwrite && Path.isFile(file))
            throw new FileExistsException(file);

        const dirname = path.dirname(file);
        if (!Directory.exists(dirname))
            Directory.create(dirname);

        writeFileSync(file, content, 'utf8');
        return true;
    }

    public static rename(oldFile: string, newFile: string): boolean {
        Throw.ifNullOrWhiteSpace(oldFile);
        Throw.ifNullOrWhiteSpace(newFile);

        if (!this.exists(oldFile))
            throw new FileNotFoundException(oldFile);

        if (this.exists(newFile))
            throw new FileExistsException(newFile);

        renameSync(oldFile, newFile);

        return true;
    }

    public static delete(file: string): boolean {
        Throw.ifNullOrWhiteSpace(file);

        if (this.exists(file)) {
            unlinkSync(file);
            return true;
        }

        return false;
    }

    public static exists(file: string): boolean {
        return Path.isFile(file);
    }
}