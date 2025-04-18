/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export class TransformersService {
    public static merge(
        a: { before: typescript.TransformerFactory<typescript.SourceFile>[] | null; after: typescript.TransformerFactory<typescript.SourceFile>[] | null },
        b?: typescript.CustomTransformers
    ): typescript.CustomTransformers {
        const before = [...(a.before ?? []), ...(b?.before ?? [])];
        const after = [...(a.after ?? []), ...(b?.after ?? [])];

        return {
            before: before.length > 0 ? before : undefined,
            after: after.length > 0 ? after : undefined
        };
    }
}