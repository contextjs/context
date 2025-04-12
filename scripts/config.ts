/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 * 
 * Notice: the order of the packages in the array is important, as some packages depend on others.
 */

export default class Config {
    public static version: string = "0.4.6";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packages: string[] = [
        "system",
        "io",
        "collections",
        "configuration",
        "configuration-json",
        "di",
        "routing",
        "webserver",
        "webserver-middleware-static",
        "parser",
        "context"
    ];
}