/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from 'path';
import typescript from 'typescript';

export function serviceCollectionTransformer(methods: Record<string, string>, program: typescript.Program): typescript.TransformerFactory<typescript.SourceFile> {
    return (context: typescript.TransformationContext) => {
        return (sourceFile: typescript.SourceFile) => {
            const importsMap = new Map<string, string>();
            const getModuleSpecifier = (fromFile: string, toFile: string) => {
                let moduleRelativePath = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, '/');
                if (!moduleRelativePath.startsWith('.'))
                    moduleRelativePath = './' + moduleRelativePath;

                return moduleRelativePath.replace(/\.ts$/, '.js');
            };

            const visitNode = (currentNode: typescript.Node): typescript.Node => {
                if (typescript.isCallExpression(currentNode) && typescript.isPropertyAccessExpression(currentNode.expression)) {
                    const registrationMethod = currentNode.expression.name.text;
                    const lifetimeValue = methods[registrationMethod];
                    if (!lifetimeValue)
                        return typescript.visitEachChild(currentNode, visitNode, context);

                    const genericArgs = currentNode.typeArguments;
                    if (!genericArgs || genericArgs.length === 0)
                        return currentNode;

                    let abstractTypeNode: typescript.TypeNode;
                    let concreteTypeNode: typescript.TypeNode;

                    if (genericArgs.length === 1)
                        abstractTypeNode = concreteTypeNode = genericArgs[0];
                    else if (genericArgs.length >= 2) {
                        abstractTypeNode = genericArgs[0];
                        concreteTypeNode = genericArgs[1];
                    }
                    else
                        return currentNode;

                    const interfaceId = abstractTypeNode.getText(sourceFile).trim();
                    const implementationId = concreteTypeNode.getText(sourceFile).trim();

                    let classDeclaration: typescript.ClassDeclaration | undefined;
                    for (const file of program.getSourceFiles()) {
                        if (!file.isDeclarationFile) {
                            const statement = file.statements.find((statement) => typescript.isClassDeclaration(statement) && statement.name?.text === implementationId);
                            if (statement) {
                                classDeclaration = statement as typescript.ClassDeclaration;
                                break;
                            }
                        }
                    }

                    if (!classDeclaration)
                        console.warn(`Could not find class declaration for "${implementationId}". Constructor metadata will be omitted.`);

                    let stringLiteral: typescript.Expression = typescript.factory.createStringLiteral(implementationId);
                    if (typescript.isTypeReferenceNode(concreteTypeNode)) {
                        const concreteName = typescript.isIdentifier(concreteTypeNode.typeName)
                            ? concreteTypeNode.typeName.text
                            : concreteTypeNode.typeName.getText(sourceFile);

                        const concreteType = program.getTypeChecker().getTypeFromTypeNode(concreteTypeNode);
                        let symbol = program.getTypeChecker().getSymbolAtLocation(concreteTypeNode.typeName)!;

                        if (symbol.flags & typescript.SymbolFlags.Alias)
                            symbol = program.getTypeChecker().getAliasedSymbol(symbol);

                        const classDeclaration = symbol.declarations?.find(typescript.isClassDeclaration);
                        if (classDeclaration && classDeclaration.getSourceFile().fileName !== sourceFile.fileName)
                            importsMap.set(concreteName, getModuleSpecifier(sourceFile.fileName, classDeclaration.getSourceFile().fileName));

                        const interfaceSymbol = concreteType.getSymbol();
                        if (interfaceSymbol && interfaceSymbol.declarations && interfaceSymbol.declarations.some((d) => typescript.isInterfaceDeclaration(d)))
                            stringLiteral = typescript.factory.createStringLiteral(interfaceSymbol.name);
                        else
                            stringLiteral = typescript.factory.createIdentifier(concreteName);
                    }

                    const constructorParameters: typescript.Expression[] = [];

                    if (classDeclaration) {
                        const constructorDeclaration = classDeclaration.members.find(typescript.isConstructorDeclaration);
                        if (constructorDeclaration) {
                            for (const constructorParameter of constructorDeclaration.parameters) {
                                let parameterName: string;
                                if (typescript.isIdentifier(constructorParameter.name))
                                    parameterName = constructorParameter.name.text;
                                else if ('escapedText' in constructorParameter.name)
                                    parameterName = String(constructorParameter.name.escapedText);
                                else
                                    parameterName = constructorParameter.name.getText(sourceFile);

                                let parameterIdentifier: typescript.Expression = typescript.factory.createIdentifier('undefined');
                                if (constructorParameter.type) {
                                    if (typescript.isTypeReferenceNode(constructorParameter.type)) {
                                        const parameterTypeName = typescript.isIdentifier(constructorParameter.type.typeName)
                                            ? constructorParameter.type.typeName.text
                                            : constructorParameter.type.typeName.getText(sourceFile);

                                        const parameterType = program.getTypeChecker().getTypeFromTypeNode(constructorParameter.type);
                                        const parameterSymbol = parameterType.getSymbol();

                                        if (parameterSymbol && parameterSymbol.declarations && parameterSymbol.declarations.some((declaration) => typescript.isInterfaceDeclaration(declaration)))
                                            parameterIdentifier = typescript.factory.createStringLiteral(parameterSymbol.name);
                                        else
                                            parameterIdentifier = typescript.factory.createIdentifier(parameterTypeName);

                                    }
                                    else if (constructorParameter.type.kind >= typescript.SyntaxKind.FirstKeyword && constructorParameter.type.kind <= typescript.SyntaxKind.LastKeyword) {
                                        const keywordName = typescript.SyntaxKind[constructorParameter.type.kind];
                                        const typeName = keywordName.replace(/Keyword$/, '');
                                        parameterIdentifier = typescript.factory.createIdentifier(typeName);
                                    }
                                }

                                constructorParameters.push(typescript.factory.createObjectLiteralExpression([
                                    typescript.factory.createPropertyAssignment('name', typescript.factory.createStringLiteral(parameterName)),
                                    typescript.factory.createPropertyAssignment('type', parameterIdentifier),
                                ]));
                            }
                        }
                    }

                    const serviceDescriptor = typescript.factory.createObjectLiteralExpression([
                        typescript.factory.createPropertyAssignment('lifetime', typescript.factory.createStringLiteral(lifetimeValue)),
                        typescript.factory.createPropertyAssignment('type', stringLiteral),
                        typescript.factory.createPropertyAssignment('parameters', typescript.factory.createArrayLiteralExpression(constructorParameters, true)),
                    ], true);

                    return typescript.factory.createCallExpression(
                        typescript.factory.createPropertyAccessExpression(
                            typescript.factory.createPropertyAccessExpression(
                                currentNode.expression.expression,
                                typescript.factory.createIdentifier('dependenciesAccessor')
                            ),
                            typescript.factory.createIdentifier('set')
                        ),
                        undefined,
                        [
                            typescript.factory.createStringLiteral(interfaceId),
                            serviceDescriptor,
                        ]
                    );
                }

                return typescript.visitEachChild(currentNode, visitNode, context);
            };

            const updatedSourceFile = typescript.visitNode(sourceFile, visitNode, typescript.isSourceFile);

            const existingImports = new Set<string>();
            for (const statement of updatedSourceFile.statements) {
                if (typescript.isImportDeclaration(statement) && statement.importClause?.namedBindings && typescript.isNamedImports(statement.importClause.namedBindings))
                    for (const element of statement.importClause.namedBindings.elements)
                        existingImports.add(element.name.text);
            }

            const importDeclarations: typescript.ImportDeclaration[] = [];
            for (const [name, modulePath] of importsMap) {
                const importDeclClause = typescript.factory.createImportClause(
                    false,
                    undefined,
                    typescript.factory.createNamedImports([typescript.factory.createImportSpecifier(false, undefined, typescript.factory.createIdentifier(name))])
                );
                importDeclarations.push(typescript.factory.createImportDeclaration(undefined, importDeclClause, typescript.factory.createStringLiteral(modulePath), undefined));
            }

            return typescript.factory.updateSourceFile(updatedSourceFile, [...importDeclarations, ...updatedSourceFile.statements]);
        };
    };
}