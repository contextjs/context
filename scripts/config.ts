/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

export default class Config {
    public static version: string = "0.0.6";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packages: string[] = [
        "core",
        "context"
    ];
}