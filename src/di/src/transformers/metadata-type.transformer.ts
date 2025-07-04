/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export function paramTypesRewriter(program: typescript.Program): typescript.TransformerFactory<typescript.SourceFile> {
    const typeChecker = program.getTypeChecker();

    function isDecorate(callExpression: typescript.CallExpression): boolean {
        const expression = callExpression.expression;
        return (
            (typescript.isIdentifier(expression) && expression.text === "__decorate") ||
            (typescript.isPropertyAccessExpression(expression) && typescript.isIdentifier(expression.name) && expression.name.text === "__decorate"));
    }

    function isParamTypesMetadata(callExpression: typescript.CallExpression): boolean {
        const expression = callExpression.expression;
        const args = callExpression.arguments;
        return (
            ((typescript.isIdentifier(expression) && expression.text === "__metadata") ||
                (typescript.isPropertyAccessExpression(expression) && typescript.isIdentifier(expression.name) && expression.name.text === "__metadata")) &&
            args.length === 2 &&
            typescript.isStringLiteral(args[0]) &&
            args[0].text === "design:paramtypes"
        );
    }

    return (context: typescript.TransformationContext) => {
        const factory = context.factory;

        function visitor(node: typescript.Node): typescript.VisitResult<typescript.Node> {
            if (typescript.isCallExpression(node) && isDecorate(node)) {
                const [decoratorArrayExpression, classTarget, ...restArguments] = node.arguments;

                if (typescript.isArrayLiteralExpression(decoratorArrayExpression) && typescript.isIdentifier(classTarget)) {
                    const classSymbol = typeChecker.getSymbolAtLocation(classTarget);
                    const classDeclaration = classSymbol?.valueDeclaration;
                    if (classDeclaration && typescript.isClassDeclaration(classDeclaration)) {
                        const constructorDeclaration = classDeclaration.members.find(typescript.isConstructorDeclaration);
                        if (constructorDeclaration) {
                            const parameterTypeNames = constructorDeclaration.parameters.map((param) => {
                                const parameterType = typeChecker.getTypeAtLocation(param);
                                const parameterSymbol = parameterType.symbol ?? parameterType.aliasSymbol;
                                const typeName = parameterSymbol?.getName() ?? "Object";
                                return factory.createStringLiteral(typeName);
                            });

                            const updatedDecoratorElements = decoratorArrayExpression.elements.map((decoratorExpression) => {
                                if (typescript.isCallExpression(decoratorExpression) && isParamTypesMetadata(decoratorExpression)) {
                                    return factory.updateCallExpression(
                                        decoratorExpression,
                                        decoratorExpression.expression,
                                        undefined,
                                        [
                                            decoratorExpression.arguments[0],
                                            factory.createArrayLiteralExpression(parameterTypeNames, false)
                                        ]
                                    );
                                }
                                return decoratorExpression;
                            });

                            const updatedDecoratorArray = factory.updateArrayLiteralExpression(decoratorArrayExpression, updatedDecoratorElements);

                            return factory.updateCallExpression(node, node.expression, undefined, [updatedDecoratorArray, classTarget, ...restArguments]);
                        }
                    }
                }
            }

            return typescript.visitEachChild(node, visitor, context);
        }

        return (sourceFile: typescript.SourceFile) => typescript.visitNode(sourceFile, visitor) as typescript.SourceFile;
    };
}