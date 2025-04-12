/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import ts from 'typescript';

export function transientServiceTransformer(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> {
    return (file: ts.SourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
            //Placeholder for intercepting the TransientService
            return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(file, visitor, ts.isSourceFile);
    };
}