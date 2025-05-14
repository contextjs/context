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
    public static version: string = "0.5.1-alpha.1";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packageDescriptors: Map<string, string[]> = new Map<string, string[]>([
        ["system", []],
        ["io", []],
        ["collections", []],
        ["text", []],
        ["configuration", ["configuration", "configuration-json"]],
        ["di", []],
        ["routing", []],
        ["webserver", ["webserver", "webserver-middleware-static", "webserver-middleware-cookies"]],
        ["compiler", []],
        ["context", []],
        ["symplex", ["symplex-parser"]]
    ]);
}