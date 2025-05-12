/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Throw } from "@contextjs/system";
import fs from "node:fs";
import * as nodePath from 'node:path'

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
        Throw.ifNullOrWhiteSpace(path);

        return nodePath.normalize(path).replace(/^(\.\.[\/\\])+/, '');
    }
}