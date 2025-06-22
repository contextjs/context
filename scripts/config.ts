/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 * 
 * Notice: the order of the packages in the array is important, as some packages depend on others.
 */

import type PackageInfo from "./package-info";

export default class Config {
    public static version: string = "25.0.0";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packagesInfo: PackageInfo[] = [
        { name: "system", path: "system" },
        { name: "io", path: "io" },
        { name: "collections", path: "collections" },
        { name: "text", path: "text" },
        { name: "configuration", path: "configuration/configuration" },
        { name: "configuration-json", path: "configuration/configuration-json" },
        { name: "routing", path: "routing" },
        { name: "di", path: "di" },
        { name: "webserver", path: "webserver/webserver" },
        { name: "webserver-middleware-static", path: "webserver/webserver-middleware-static" },
        { name: "webserver-middleware-cookies", path: "webserver/webserver-middleware-cookies" },
        { name: "webserver-middleware-controllers", path: "webserver/webserver-middleware-controllers" },
        { name: "compiler", path: "compiler" },
        { name: "views-parser", path: "views/views-parser" },
        { name: "views-language-server", path: "views/views-language-server" },
        { name: "context", path: "context" }
    ];
}