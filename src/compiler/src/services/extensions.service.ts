/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { ICompilerExtension } from "../interfaces/i-compiler-extension.js";

export class ExtensionsService {
    private static readonly extensions: ICompilerExtension[] = [];

    public static register(extension: ICompilerExtension): void {
        this.extensions.push(extension);
    }

    public static getTransformers(program: typescript.Program): {
        before: typescript.TransformerFactory<typescript.SourceFile>[] | null;
        after: typescript.TransformerFactory<typescript.SourceFile>[] | null;
    } {
        const before: typescript.TransformerFactory<typescript.SourceFile>[] = [];
        const after: typescript.TransformerFactory<typescript.SourceFile>[] = [];

        for (const extension of this.extensions) {
            const result = extension.getTransformers(program);
            if (result.before)
                before.push(...result.before);
            if (result.after)
                after.push(...result.after);
        }

        return {
            before: before.length > 0 ? before : null,
            after: after.length > 0 ? after : null
        };
    }
}