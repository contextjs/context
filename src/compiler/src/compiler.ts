/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ICompilerExtension } from "./interfaces/i-compiler-extension.js";
import { CompileService } from "./services/compile.service.js";
import { DiagnosticsService } from "./services/diagnostics.service.js";
import { ExtensionsService } from "./services/extensions.service.js";

export class Compiler {
    public static compile = CompileService.compile;
    public static formatTypescriptDiagnostics = DiagnosticsService.formatTypescriptDiagnostics;

    public static registerExtension(extension: ICompilerExtension): void {
        ExtensionsService.register(extension);
    }
}