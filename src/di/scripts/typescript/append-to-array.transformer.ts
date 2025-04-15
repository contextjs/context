/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export function appendToArrayTransformer(propertyName: string, elements: string[]): typescript.TransformerFactory<typescript.SourceFile> {
    return () => {
        return (sourceFile) => {
            const statements = sourceFile.statements.map(statement => {
                if (!typescript.isClassDeclaration(statement))
                    return statement;

                const members = statement.members.map(member => {
                    if (typescript.isPropertyDeclaration(member) &&
                        typescript.isIdentifier(member.name) &&
                        member.name.text === propertyName &&
                        member.initializer &&
                        typescript.isArrayLiteralExpression(member.initializer)) {
                        const existingNames = new Set(member.initializer.elements.filter(typescript.isIdentifier).map(id => id.text));
                        const additions = elements
                            .filter(name => !existingNames.has(name))
                            .map(name => typescript.factory.createIdentifier(name));

                        const updatedArray = typescript.factory.updateArrayLiteralExpression(
                            member.initializer,
                            [...member.initializer.elements, ...additions]);

                        return typescript.factory.updatePropertyDeclaration(
                            member,
                            member.modifiers,
                            member.name,
                            member.questionToken,
                            member.type,
                            updatedArray);
                    }

                    return member;
                });

                return typescript.factory.updateClassDeclaration(
                    statement,
                    statement.modifiers,
                    statement.name,
                    statement.typeParameters,
                    statement.heritageClauses,
                    members);
            });

            return typescript.factory.updateSourceFile(sourceFile, statements);
        };
    };
}