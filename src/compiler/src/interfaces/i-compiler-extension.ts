/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export interface ICompilerExtension {
    name: string;
    getTransformers(program: typescript.Program): {
        before: typescript.TransformerFactory<typescript.SourceFile>[] | null;
        after: typescript.TransformerFactory<typescript.SourceFile>[] | null;
    };
}