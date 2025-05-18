import typescript from "typescript";

export function stripDecoratorsTransformer(): typescript.TransformerFactory<typescript.SourceFile> {
    return () => {
        return (sourceFile: typescript.SourceFile): typescript.SourceFile => {
            const filtered = sourceFile.statements.filter(statement => {
                if (typescript.isVariableStatement(statement) &&
                    statement.declarationList.declarations.some(declaration => typescript.isIdentifier(declaration.name) && declaration.name.text === "__decorate"))
                    return false;

                if (typescript.isExpressionStatement(statement) &&
                    typescript.isCallExpression(statement.expression) &&
                    typescript.isIdentifier(statement.expression.expression) &&
                    statement.expression.expression.text === "__decorate")
                    return false;

                return true;
            });

            return typescript.factory.updateSourceFile(
                sourceFile,
                typescript.factory.createNodeArray(filtered),
                sourceFile.isDeclarationFile,
                sourceFile.referencedFiles,
                sourceFile.typeReferenceDirectives,
                sourceFile.hasNoDefaultLib,
                sourceFile.libReferenceDirectives
            );
        };
    };
}