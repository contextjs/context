/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/core";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { PathNotFoundException } from "../exceptions/path-not-found.exception.js";
import { Path } from "./path.js";

export class Directory {
    public static create(directory: string): boolean {
        Throw.ifNullOrWhiteSpace(directory);

        if (Path.exists(directory))
            return false;

        mkdirSync(directory, { recursive: true });
        return true;
    }

    public static rename(oldDirectory: string, newDirectory: string): boolean {
        Throw.ifNullOrWhiteSpace(oldDirectory);
        Throw.ifNullOrWhiteSpace(newDirectory);

        if (!Directory.exists(oldDirectory))
            throw new PathNotFoundException(oldDirectory);

        if (Path.exists(newDirectory))
            throw new Error(`The path '${newDirectory}' already exists.`);

        renameSync(oldDirectory, newDirectory);

        return true;
    }

    public static delete(directory: string): boolean {
        Throw.ifNullOrWhiteSpace(directory);

        if (!Path.exists(directory))
            return true;

        rmSync(directory, { recursive: true });

        return true;
    }

    public static exists(directory: string): boolean {
        Throw.ifNullOrWhiteSpace(directory);

        return Path.isDirectory(directory);
    }

    public static isEmpty(directory: string): boolean {
        if (!Path.isDirectory(directory))
            throw new PathNotFoundException(directory);

        return readdirSync(directory).length === 0;
    }
}