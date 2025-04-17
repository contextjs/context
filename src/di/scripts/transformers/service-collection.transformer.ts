/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from 'typescript';

export function serviceCollectionTransformer(methods: Record<string, string>, program: typescript.Program): typescript.TransformerFactory<typescript.SourceFile> {
    return (context: typescript.TransformationContext) => {
        return (sourceFile: typescript.SourceFile) => {
            const visitor = (node: typescript.Node): typescript.Node => {
                if (typescript.isCallExpression(node) &&
                    typescript.isPropertyAccessExpression(node.expression)) {
                    const methodName = node.expression.name.text;
                    const lifetime = methods[methodName];
                    if (!lifetime)
                        return typescript.visitEachChild(node, visitor, context);

                    const typeArguments = node.typeArguments;
                    if (!typeArguments || typeArguments.length === 0)
                        return node;

                    let interfaceType: typescript.TypeNode;
                    let implementationType: typescript.TypeNode;

                    if (typeArguments.length === 1)
                        interfaceType = implementationType = typeArguments[0];
                    else if (typeArguments.length >= 2) {
                        interfaceType = typeArguments[0];
                        implementationType = typeArguments[1];
                    }
                    else
                        return node;

                    const interfaceName = interfaceType.getText(sourceFile).trim();
                    const implementationName = implementationType.getText(sourceFile).trim();

                    let classDeclaration: typescript.ClassDeclaration | undefined;
                    for (const file of program.getSourceFiles()) {
                        if (!file.isDeclarationFile) {
                            const match = file.statements.find((t) => typescript.isClassDeclaration(t) && t.name?.text === implementationName);
                            if (match) {
                                classDeclaration = match as typescript.ClassDeclaration;
                                break;
                            }
                        }
                    }

                    if (!classDeclaration)
                        console.warn(`Could not find class declaration for "${implementationName}". Constructor metadata will be omitted.`);

                    let typeExpression: typescript.Expression = typescript.factory.createStringLiteral(implementationName);
                    if (typescript.isTypeReferenceNode(implementationType)) {
                        const typeName = typescript.isIdentifier(implementationType.typeName)
                            ? implementationType.typeName.text
                            : implementationType.typeName.getText(sourceFile);

                        const type = program.getTypeChecker().getTypeFromTypeNode(implementationType);
                        const symbol = type.getSymbol();

                        if (symbol && symbol.declarations && symbol.declarations.some((t) => typescript.isInterfaceDeclaration(t)))
                            typeExpression = typescript.factory.createStringLiteral(symbol.name);
                        else
                            typeExpression = typescript.factory.createIdentifier(typeName);
                    }

                    const parameters: typescript.Expression[] = [];

                    if (classDeclaration) {
                        const constructor = classDeclaration.members.find(typescript.isConstructorDeclaration);
                        if (constructor) {
                            for (const parameter of constructor.parameters) {
                                let name: string;
                                if (typescript.isIdentifier(parameter.name))
                                    name = parameter.name.text;
                                else if ('escapedText' in parameter.name)
                                    name = String(parameter.name.escapedText);
                                else
                                    name = parameter.name.getText(sourceFile);

                                let parameterTypeExpression: typescript.Expression = typescript.factory.createIdentifier("undefined");

                                if (parameter.type) {
                                    if (typescript.isTypeReferenceNode(parameter.type)) {
                                        const typeName = typescript.isIdentifier(parameter.type.typeName)
                                            ? parameter.type.typeName.text
                                            : parameter.type.typeName.getText(sourceFile);

                                        const type = program.getTypeChecker().getTypeFromTypeNode(parameter.type);
                                        const symbol = type.getSymbol();

                                        if (symbol && symbol.declarations && symbol.declarations.some(t => typescript.isInterfaceDeclaration(t)))
                                            parameterTypeExpression = typescript.factory.createStringLiteral(symbol.name);
                                        else
                                            parameterTypeExpression = typescript.factory.createIdentifier(typeName);
                                    }
                                    else if (parameter.type.kind >= typescript.SyntaxKind.FirstKeyword && parameter.type.kind <= typescript.SyntaxKind.LastKeyword) {
                                        const keywordName = typescript.SyntaxKind[parameter.type.kind];
                                        const typeName = keywordName.replace(/Keyword$/, "");
                                        parameterTypeExpression = typescript.factory.createIdentifier(typeName);
                                    }
                                }

                                parameters.push(
                                    typescript.factory.createObjectLiteralExpression([
                                        typescript.factory.createPropertyAssignment(
                                            "name",
                                            typescript.factory.createStringLiteral(name)
                                        ),
                                        typescript.factory.createPropertyAssignment("type", parameterTypeExpression),
                                    ])
                                );
                            }
                        }
                    }

                    const serviceObject = typescript.factory.createObjectLiteralExpression(
                        [
                            typescript.factory.createPropertyAssignment("lifetime", typescript.factory.createStringLiteral(lifetime)),
                            typescript.factory.createPropertyAssignment("type", typeExpression),
                            typescript.factory.createPropertyAssignment(
                                "parameters",
                                typescript.factory.createArrayLiteralExpression(parameters, true)
                            ),
                        ],
                        true
                    );

                    return typescript.factory.createCallExpression(
                        typescript.factory.createPropertyAccessExpression(
                            typescript.factory.createPropertyAccessExpression(
                                node.expression.expression,
                                typescript.factory.createIdentifier("dependenciesAccessor")
                            ),
                            typescript.factory.createIdentifier("set")
                        ),
                        undefined,
                        [
                            typescript.factory.createStringLiteral(interfaceName),
                            serviceObject
                        ]
                    );
                }

                return typescript.visitEachChild(node, visitor, context);
            };

            return typescript.visitNode(sourceFile, visitor, typescript.isSourceFile);
        };
    };
}