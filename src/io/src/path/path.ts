/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { existsSync, lstatSync } from "node:fs";

export class Path {
    public static exists(path: string): boolean {
        return existsSync(path);
    }

    public static isDirectory(path: string): boolean {
        return this.exists(path) && lstatSync(path).isDirectory();
    }

    public static isFile(path: string): boolean {
        return this.exists(path) && lstatSync(path).isFile();
    }
}