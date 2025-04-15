/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from 'typescript';

export function addImportTransformer(className: string, classPath: string): typescript.TransformerFactory<typescript.SourceFile> {
    return () => {
        return (sourceFile) => {
            if (sourceFile.statements.some(statement =>
                typescript.isImportDeclaration(statement) &&
                typescript.isStringLiteral(statement.moduleSpecifier) &&
                statement.moduleSpecifier.text === classPath &&
                statement.importClause &&
                typescript.isImportClause(statement.importClause) &&
                statement.importClause.namedBindings &&
                typescript.isNamedImports(statement.importClause.namedBindings) &&
                statement.importClause.namedBindings.elements.some(e => e.name.text === className)))
                return sourceFile;

            const importSpecifier = typescript.factory.createImportSpecifier(
                false,
                undefined,
                typescript.factory.createIdentifier(className));

            const importClause = typescript.factory.createImportClause(
                false,
                undefined,
                typescript.factory.createNamedImports([importSpecifier])
            );

            const importDeclaration = typescript.factory.createImportDeclaration(
                undefined,
                importClause,
                typescript.factory.createStringLiteral(classPath)
            );

            return typescript.factory.updateSourceFile(sourceFile, [importDeclaration, ...sourceFile.statements]);
        };
    };
}