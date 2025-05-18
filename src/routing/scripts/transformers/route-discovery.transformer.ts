import * as fs from "fs";
import * as path from "path";
import typescript from "typescript";
import { RouteInfo } from "@contextjs/routing";

interface DiscoveredRoute {
    className?: string;
    methodName?: string;
    filePath: string;
    decoratorArguments: string[];
}

export class RouteDefinition {
    constructor(
        public readonly classReference: any,
        public readonly methodName: string | undefined,
        public readonly routeInfo: RouteInfo
    ) { }
}

export function routeDiscoveryTransformer(program: typescript.Program) {
    let outputFile = getGeneratedFilePath(program, ".context/routes.generated.ts");
    const discovered: DiscoveredRoute[] = [];

    function collectDecoratorArgs(decorator: typescript.Decorator): string[] {
        if (typescript.isCallExpression(decorator.expression))
            return decorator.expression.arguments.map(arg => arg.getText());

        return [];
    }

    function visitSourceFile(sourceFile: typescript.SourceFile) {
        function visit(node: typescript.Node): typescript.Node | undefined {
            if (typescript.isClassDeclaration(node) && node.name) {
                const classDecorators = getDecorators(node);
                if (classDecorators) {
                    for (const decorator of classDecorators) {
                        if (isRouteDecorator(decorator))
                            discovered.push({ className: node.name.text, filePath: sourceFile.fileName, decoratorArguments: collectDecoratorArgs(decorator) });
                    }
                }

                for (const member of node.members) {
                    if (typescript.isMethodDeclaration(member) && member.name && typescript.isIdentifier(member.name)) {
                        const methodDecorators = getDecorators(member);
                        if (methodDecorators) {
                            for (const decorator of methodDecorators) {
                                if (isRouteDecorator(decorator))
                                    discovered.push({ className: node.name.text, methodName: member.name.text, filePath: sourceFile.fileName, decoratorArguments: collectDecoratorArgs(decorator) });
                            }
                        }
                    }
                }
            }

            if (typescript.isFunctionDeclaration(node) && node.name) {
                const functionDecorators = getDecorators(node);
                if (functionDecorators) {
                    for (const decorator of functionDecorators) {
                        if (isRouteDecorator(decorator))
                            discovered.push({ className: undefined, methodName: node.name.text, filePath: sourceFile.fileName, decoratorArguments: collectDecoratorArgs(decorator) });
                    }
                }
            }

            return typescript.forEachChild(node, visit);
        }

        visit(sourceFile);
    }

    return () => (sourceFile: typescript.SourceFile) => {
        visitSourceFile(sourceFile);

        if (isLastSourceFile(program, sourceFile))
            emitRegistryFile(discovered, outputFile);

        return sourceFile;
    };
}

function isRouteDecorator(decorator: typescript.Decorator): boolean {
    if (typescript.isCallExpression(decorator.expression)) {
        const expression = decorator.expression.expression;
        return typescript.isIdentifier(expression) && expression.text === "Route";
    }

    return false;
}

function isLastSourceFile(program: typescript.Program, file: typescript.SourceFile): boolean {
    const all = program.getSourceFiles().filter(sourceFile => !sourceFile.isDeclarationFile);
    return all[all.length - 1].fileName === file.fileName;
}

function emitRegistryFile(discovered: DiscoveredRoute[], outputFile: string) {
    const lines: string[] = [
        "/**",
        " * @license",
        " * Copyright ContextJS All Rights Reserved.",
        " *",
        " * Use of this source code is governed by an MIT-style license that can be",
        " * found at https://github.com/contextjs/context/blob/main/LICENSE",
        " *",
        " * AUTO-GENERATED FILE. DO NOT EDIT.",
        " */",
        "",
        "import { RouteInfo } from \"@contextjs/routing\";",
    ];

    const importMap = new Map<string, string>();
    let importCount = 0;
    for (const route of discovered) {
        if (!importMap.has(route.filePath)) {
            let relativePath = path.relative(path.dirname(outputFile), route.filePath).replace(/\\/g, "/");
            if (!relativePath.startsWith("."))
                relativePath = "./" + relativePath;

            relativePath = relativePath.replace(/\.ts$/, ".js");

            const importName = `RoutesImport${importCount++}`;
            lines.push(`import * as ${importName} from "${relativePath}";`);
            importMap.set(route.filePath, importName);
        }
    }

    lines.push("", "export const discoveredRoutes = [");
    for (const route of discovered) {
        const importName = importMap.get(route.filePath)!;
        const classRef = route.className ? `${importName}.${route.className}` : "undefined";
        const methodRef = route.methodName ? `"${route.methodName}"` : "undefined";
        const [templateArg, nameArg] = route.decoratorArguments;
        const nameLiteral = nameArg;
        const routeInfo = nameLiteral
            ? `routeInfo: new RouteInfo(${templateArg}, ${nameLiteral}),`
            : `routeInfo: new RouteInfo(${templateArg}),`;

        lines.push(
            `  {`,
            `    classReference: ${classRef},`,
            `    methodName: ${methodRef},`,
            `    ${routeInfo}`,
            `  },`
        );
    }
    lines.push("];", "", "export default discoveredRoutes;");

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, lines.join("\n"), "utf8");
}


function getDecorators(node: typescript.Node): readonly typescript.Decorator[] | undefined {
    if ((typescript as any).canHaveDecorators && (typescript as any).getDecorators) {
        return (typescript as any).canHaveDecorators(node)
            ? (typescript as any).getDecorators(node)
            : undefined;
    }
    return (node as any).decorators;
}

function getGeneratedFilePath(program: typescript.Program, relativePath: string): string {
    const { rootDir } = program.getCompilerOptions();
    const baseDir = rootDir || process.cwd();

    return path.resolve(baseDir, relativePath);
}