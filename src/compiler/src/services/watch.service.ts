/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { ICompilerOptions } from "../interfaces/i-compiler-options.js";
import { ExtensionsService } from "./extensions.service.js";
import { ProjectsService } from "./projects.service.js";
import { TransformersService } from "./transformers.service.js";

export class WatchService {
    public static watch(projectPath: string, options?: ICompilerOptions): void {
        const parsed = ProjectsService.getParsedConfig(projectPath);

        const createProgram = typescript.createSemanticDiagnosticsBuilderProgram;
        const host = typescript.createWatchCompilerHost(
            parsed.configPath || "tsconfig.json",
            parsed.config.options,
            typescript.sys,
            createProgram,
            (diagnostic) => { options?.onDiagnostic?.(diagnostic) },
            (diagnostic) => { options?.onDiagnostic?.(diagnostic); }
        );

        const originalCreateProgram = host.createProgram;
        host.createProgram = ((rootNames, options, host, oldProgram) => {
            return originalCreateProgram(rootNames, options, host, oldProgram);
        }) as typescript.CreateProgram<typescript.SemanticDiagnosticsBuilderProgram>;

        const originalAfterProgramCreate = host.afterProgramCreate;
        host.afterProgramCreate = builder => {
            const internal = ExtensionsService.getTransformers(builder.getProgram());
            const merged = TransformersService.merge(internal, options?.transformers);

            const originalEmit = builder.emit;
            builder.emit = (targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles) => {
                return originalEmit(
                    targetSourceFile,
                    writeFile,
                    cancellationToken,
                    emitOnlyDtsFiles,
                    merged
                );
            };

            originalAfterProgramCreate?.(builder);
        };

        typescript.createWatchProgram(host);
    }
}