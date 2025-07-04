/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from 'typescript';

export function serviceResolverTransformer(context: typescript.TransformationContext): typescript.Transformer<typescript.SourceFile> {
    return (sourceFile: typescript.SourceFile) => {
        const visitor = (node: typescript.Node): typescript.Node => {
            if (typescript.isCallExpression(node) &&
                typescript.isPropertyAccessExpression(node.expression) &&
                node.expression.name.text === "resolve" &&
                node.typeArguments &&
                node.typeArguments.length === 1) {
                const typeArg = node.typeArguments[0];
                const interfaceName = typeArg.getText(sourceFile);

                return typescript.factory.createCallExpression(
                    typescript.factory.createPropertyAccessExpression(
                        node.expression.expression,
                        typescript.factory.createIdentifier("resolve")
                    ),
                    undefined,
                    [typescript.factory.createStringLiteral(interfaceName)]
                );
            }

            return typescript.visitEachChild(node, visitor, context);
        };

        return typescript.visitNode(sourceFile, visitor, typescript.isSourceFile);
    };
}
