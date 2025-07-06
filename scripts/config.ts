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
    public static version: string = "25.1.0";

    public static typescriptVersion: string = "^5.8.3";
    public static reflectMetadataVersion: string = "^0.2.2";
    public static nodeTypesVersion: string = "^24.0.10";
    public static nodeEngineVersion: string = "24.x";

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
        { name: "compiler", path: "compiler" },
        { name: "views", path: "views/views" },
        { name: "views-parser", path: "views/views-parser" },
        { name: "views-compiler", path: "views/views-compiler" },
        { name: "views-language-server", path: "views/views-language-server" },
        { name: "webserver", path: "webserver/webserver" },
        { name: "webserver-middleware-static", path: "webserver/webserver-middleware-static" },
        { name: "webserver-middleware-cookies", path: "webserver/webserver-middleware-cookies" },
        { name: "webserver-middleware-controllers", path: "webserver/webserver-middleware-controllers" },
        { name: "webserver-middleware-mvc", path: "webserver/webserver-middleware-mvc" },
        { name: "context", path: "context" },
        { name: "templates", path: "templates" },
        { name: "commands", path: "commands" }
    ];
}