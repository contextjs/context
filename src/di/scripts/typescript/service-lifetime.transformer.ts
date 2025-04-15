/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export function serviceLifetimeTransformer(methods: Record<string, string>): typescript.TransformerFactory<typescript.SourceFile> {
    const classPath = "./service-collection.transformer.js";
    const importName = "serviceCollectionTransformer";

    return () => {
        return (sourceFile) => {
            const methodProperties = Object.entries(methods).map(([method, lifetime]) =>
                typescript.factory.createPropertyAssignment(method, typescript.factory.createStringLiteral(lifetime))
            );

            const updatedStatements: typescript.Statement[] = [];
            let hasCreateServiceImport = false;

            for (const statement of sourceFile.statements) {
                if (typescript.isImportDeclaration(statement) &&
                    typescript.isStringLiteral(statement.moduleSpecifier) &&
                    statement.moduleSpecifier.text === classPath
                ) {
                    const namedBindings = statement.importClause?.namedBindings;
                    if (
                        namedBindings &&
                        typescript.isNamedImports(namedBindings) &&
                        namedBindings.elements.some(el => el.name.text === importName)
                    ) {
                        hasCreateServiceImport = true;
                    }
                }

                updatedStatements.push(statement);
            }

            // Add import if not already present
            if (!hasCreateServiceImport) {
                const importDecl = typescript.factory.createImportDeclaration(
                    undefined,
                    typescript.factory.createImportClause(
                        false,
                        undefined,
                        typescript.factory.createNamedImports([
                            typescript.factory.createImportSpecifier(
                                false,
                                undefined,
                                typescript.factory.createIdentifier(importName)
                            )
                        ])
                    ),
                    typescript.factory.createStringLiteral(classPath)
                );

                updatedStatements.unshift(importDecl);
            }

            // Update class
            const transformed = updatedStatements.map(stmt => {
                if (
                    typescript.isClassDeclaration(stmt) &&
                    stmt.name?.text === "TransformersService"
                ) {
                    const updatedMembers = stmt.members.map(member => {
                        if (typescript.isConstructorDeclaration(member) && member.body) {
                            const pushCall = typescript.factory.createExpressionStatement(
                                typescript.factory.createCallExpression(
                                    typescript.factory.createPropertyAccessExpression(
                                        typescript.factory.createPropertyAccessExpression(
                                            typescript.factory.createThis(),
                                            typescript.factory.createIdentifier("transformers")
                                        ),
                                        typescript.factory.createIdentifier("push")
                                    ),
                                    undefined,
                                    [
                                        typescript.factory.createCallExpression(
                                            typescript.factory.createIdentifier(importName),
                                            undefined,
                                            [
                                                typescript.factory.createObjectLiteralExpression(methodProperties, true),
                                                typescript.factory.createIdentifier("program")
                                            ]
                                        )
                                    ]
                                )
                            );

                            const alreadyInjected = member.body.statements.some(stmt =>
                                typescript.isExpressionStatement(stmt) &&
                                typescript.isCallExpression(stmt.expression) &&
                                typescript.isPropertyAccessExpression(stmt.expression.expression) &&
                                stmt.expression.expression.name.text === "push" &&
                                stmt.expression.expression.expression.getText() === "this.transformers" &&
                                typescript.isCallExpression(stmt.expression.arguments[0]) &&
                                stmt.expression.arguments[0].expression.getText() === importName
                            );

                            if (alreadyInjected) return member;

                            const newBody = typescript.factory.updateBlock(member.body, [
                                ...member.body.statements,
                                pushCall
                            ]);

                            return typescript.factory.updateConstructorDeclaration(
                                member,
                                member.modifiers,
                                member.parameters,
                                newBody
                            );
                        }

                        return member;
                    });

                    return typescript.factory.updateClassDeclaration(
                        stmt,
                        stmt.modifiers,
                        stmt.name,
                        stmt.typeParameters,
                        stmt.heritageClauses,
                        updatedMembers
                    );
                }

                return stmt;
            });

            return typescript.factory.updateSourceFile(sourceFile, transformed);
        };
    };
}
