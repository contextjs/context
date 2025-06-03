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
    public static version: string = "25.0.0-beta.2";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packageDescriptors: Map<string, string[]> = new Map<string, string[]>([
        ["system", []],
        ["io", []],
        ["collections", []],
        ["text", []],
        ["configuration", ["configuration", "configuration-json"]],
        ["routing", []],
        ["di", []],
        ["webserver", [
            "webserver",
            "webserver-middleware-static",
            "webserver-middleware-cookies",
            "webserver-middleware-controllers"]],
        ["compiler", []],
        ["context", []]
    ]);
}