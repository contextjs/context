/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { ICompilerOptions } from "../interfaces/i-compiler-options.js";
import { ICompilerResult } from "../interfaces/i-compiler-result.js";
import { DiagnosticsService } from "./diagnostics.service.js";
import { ExtensionsService } from "./extensions.service.js";
import { ProjectsService } from "./projects.service.js";
import { TransformersService } from "./transformers.service.js";

export class CompileService {
    public static compile(projectPath: string, options?: ICompilerOptions): ICompilerResult {
        
        const tsFiles = ProjectsService.getSourceFiles(projectPath);
        const parsed = ProjectsService.getParsedConfig(projectPath);

        const program = typescript.createProgram(tsFiles, parsed.options);
        const internal = ExtensionsService.getTransformers(program);
        const transformers = TransformersService.merge(internal, options?.transformers);

        const emitResult = program.emit(undefined, undefined, undefined, undefined, transformers);
        const rawDiagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        const diagnostics = DiagnosticsService.formatTypescriptDiagnostics(rawDiagnostics);

        for (const diagnostic of diagnostics)
            options?.onDiagnostic?.(diagnostic);

        return {
            success: emitResult.emitSkipped === false,
            diagnostics
        };
    }
}