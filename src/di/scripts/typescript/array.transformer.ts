/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export function createArrayAppendTransformer(classPropertyName: string, elementsToAdd: string[]): typescript.TransformerFactory<typescript.SourceFile> {
    return () => {
        return (sourceFile) => {
            const updatedStatements = sourceFile.statements.map(statement => {
                if (!typescript.isClassDeclaration(statement)) return statement;

                const updatedMembers = statement.members.map(member => {
                    if (
                        typescript.isPropertyDeclaration(member) &&
                        typescript.isIdentifier(member.name) &&
                        member.name.text === classPropertyName &&
                        member.initializer &&
                        typescript.isArrayLiteralExpression(member.initializer)
                    ) {
                        const existing = member.initializer.elements;
                        const existingNames = new Set(existing.filter(typescript.isIdentifier).map(id => id.text));
                        const additions = elementsToAdd
                            .filter(name => !existingNames.has(name))
                            .map(name => typescript.factory.createIdentifier(name));

                        const updatedArray = typescript.factory.updateArrayLiteralExpression(
                            member.initializer,
                            [...existing, ...additions]
                        );

                        return typescript.factory.updatePropertyDeclaration(
                            member,
                            member.modifiers,
                            member.name,
                            member.questionToken,
                            member.type,
                            updatedArray
                        );
                    }

                    return member;
                });

                return typescript.factory.updateClassDeclaration(
                    statement,
                    statement.modifiers,
                    statement.name,
                    statement.typeParameters,
                    statement.heritageClauses,
                    updatedMembers
                );
            });

            return typescript.factory.updateSourceFile(sourceFile, updatedStatements);
        };
    };
}
