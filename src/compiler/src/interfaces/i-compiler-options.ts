/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export interface ICompilerOptions {
    transformers?: {
        before?: typescript.TransformerFactory<typescript.SourceFile>[];
        after?: typescript.TransformerFactory<typescript.SourceFile>[];
    };
    onDiagnostic?: (diagnostic: typescript.Diagnostic) => void;
    typescriptOptions?: typescript.CompilerOptions;
}