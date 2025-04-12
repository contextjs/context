/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from 'typescript';

export function createImportTransformer(className: string, classPath: string): typescript.TransformerFactory<typescript.SourceFile> {
    return () => {
        return (sourceFile) => {
            const alreadyImported = sourceFile.statements.some(stmt =>
                typescript.isImportDeclaration(stmt) &&
                typescript.isStringLiteral(stmt.moduleSpecifier) &&
                stmt.moduleSpecifier.text === classPath &&
                typescript.isImportClause(stmt.importClause!) &&
                typescript.isNamedImports(stmt.importClause.namedBindings!) &&
                stmt.importClause.namedBindings.elements.some(e => e.name.text === className)
            );

            if (alreadyImported)
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

            const importDecl = typescript.factory.createImportDeclaration(
                undefined,
                importClause,
                typescript.factory.createStringLiteral(classPath)
            );

            return typescript.factory.updateSourceFile(sourceFile, [importDecl, ...sourceFile.statements]);
        };
    };
}