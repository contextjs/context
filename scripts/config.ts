/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export default class Config {
    public static version: string = "0.4.6";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packages: string[] = [
        "system",
        "io",
        "collections",
        "context",
        "configuration",
        "configuration-json",
        "routing",
        "webserver",
        "webserver-middleware-static",
        "parser"
    ];
}