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
          if (!lifetime) return typescript.visitEachChild(node, visitor, context);

          const typeArgs = node.typeArguments;
          if (!typeArgs || typeArgs.length < 2) return node;

          const [interfaceType, implementationType] = typeArgs;
          const interfaceName = interfaceType.getText(sourceFile);
          const implementationName = implementationType.getText(sourceFile);

          // Look up the class declaration for the implementation
          let classDecl: typescript.ClassDeclaration | undefined;

          for (const sf of program.getSourceFiles()) {
            if (!sf.isDeclarationFile) {
              const match = sf.statements.find(
                stmt =>
                  typescript.isClassDeclaration(stmt) &&
                  stmt.name?.text === implementationName
              );
              if (match) {
                classDecl = match as typescript.ClassDeclaration;
                break;
              }
            }
          }

          const metadataArray: typescript.Expression[] = [];

          if (classDecl) {
            const constructor = classDecl.members.find(typescript.isConstructorDeclaration);
            if (constructor) {
              for (const param of constructor.parameters) {
                let name: string;

                if (typescript.isIdentifier(param.name)) {
                  name = param.name.text;
                } else {
                  name = param.name.getText(sourceFile); // handles patterns like destructuring
                }

                let typeExpr: typescript.Expression = typescript.factory.createIdentifier("undefined");

                if (param.type) {
                  if (typescript.isTypeReferenceNode(param.type)) {
                    const typeNameNode = param.type.typeName;
                    const typeName =
                      typescript.isIdentifier(typeNameNode)
                        ? typeNameNode.text
                        : typeNameNode.getText(sourceFile);

                    typeExpr = typescript.factory.createIdentifier(typeName);
                  } else if (
                    param.type.kind >= typescript.SyntaxKind.FirstKeyword &&
                    param.type.kind <= typescript.SyntaxKind.LastKeyword
                  ) {
                    const keywordName = typescript.SyntaxKind[param.type.kind]; // e.g., "StringKeyword"
                    const typeName = keywordName.replace(/Keyword$/, ""); // e.g., "String"

                    typeExpr = typescript.factory.createIdentifier(typeName);
                  }
                }

                const metadataObj = typescript.factory.createObjectLiteralExpression([
                  typescript.factory.createPropertyAssignment("name", typescript.factory.createStringLiteral(name)),
                  typescript.factory.createPropertyAssignment("type", typeExpr)
                ]);

                metadataArray.push(metadataObj);
              }


            }
          }

          return typescript.factory.createCallExpression(
            typescript.factory.createPropertyAccessExpression(
              typescript.factory.createPropertyAccessExpression(
                node.expression.expression,
                typescript.factory.createIdentifier("dependencies")
              ),
              typescript.factory.createIdentifier("set")
            ),
            undefined,
            [
              typescript.factory.createStringLiteral(interfaceName),
              typescript.factory.createIdentifier(implementationName),
              typescript.factory.createStringLiteral(lifetime),
              typescript.factory.createArrayLiteralExpression(metadataArray, true)
            ]
          );
        }

        return typescript.visitEachChild(node, visitor, context);
      };

      return typescript.visitNode(sourceFile, visitor, typescript.isSourceFile);
    };
  };
}
