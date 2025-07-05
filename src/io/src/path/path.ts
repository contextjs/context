/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";
import fs from "node:fs";
import * as nodePath from 'node:path';
import { PathNotFoundException } from "../exceptions/path-not-found.exception.js";

export class Path {
    public static exists(path: string): boolean {
        return fs.existsSync(path);
    }

    public static isDirectory(path: string): boolean {
        return Path.exists(path) && fs.statSync(path).isDirectory();
    }

    public static isFile(path: string): boolean {
        return Path.exists(path) && fs.statSync(path).isFile();
    }

    public static normalize(path: string): string {
        Throw.ifNullOrWhitespace(path);

        return nodePath.normalize(path).replace(/^(\.\.[\/\\])+/, '');
    }

    public static join(...paths: string[]): string {
        return nodePath.join(...paths.map(p => Path.normalize(p)));
    }

    public static listDirectories(directory: string): string[] {
        Throw.ifNullOrWhitespace(directory);
        if (!Path.isDirectory(directory))
            throw new PathNotFoundException(`The directory "${directory}" does not exist or is not a directory.`);

        return fs.readdirSync(directory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    public static resolve(...paths: string[]): string {
        paths.forEach(Throw.ifNullOrWhitespace);

        return nodePath.resolve(...paths);
    }
}