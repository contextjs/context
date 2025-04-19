/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ICompilerExtension } from "./interfaces/i-compiler-extension.js";
import { BuildService } from "./services/build.service.js";
import { ExtensionsService } from "./services/extensions.service.js";
import { WatchService } from "./services/watch.service.js";

export class Compiler {
    public static compile = BuildService.execute;
    public static watch = WatchService.execute;

    public static registerExtension(extension: ICompilerExtension): void {
        ExtensionsService.register(extension);
    }
}