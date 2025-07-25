/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { pathToFileURL } from 'url';

import { Directory, File, Path } from '@contextjs/io';
import { Console, ICommandContext, ObjectExtensions, StringExtensions } from '@contextjs/system';
import { Project } from "../models/project.js";

export abstract class CommandBase {
    public abstract runAsync(context: ICommandContext): Promise<void>;

    protected getProjects(context: ICommandContext, rootPaths: string[]): Project[] {
        const projectCommand = context.parsedArguments.find(arg => arg.name === "--project" || arg.name === "-p");
        const projectNames = projectCommand?.values || [];

        const projects: Project[] = [];

        for (const rootPath of rootPaths) {
            const files = Directory.listFiles(rootPath);

            for (const file of files) {
                if (Path.isFile(file) && File.getName(file) === "context.ctxp") {
                    const projectJson = JSON.parse(File.read(file));
                    const isInvalid = ObjectExtensions.isNullOrUndefined(projectJson) || StringExtensions.isNullOrWhitespace(projectJson.name);

                    if (isInvalid) {
                        Console.writeLineError(`Invalid or unnamed project file: ${file}`);
                        continue;
                    }

                    if (projectNames.length > 0 && !projectNames.includes(projectJson.name))
                        continue;

                    projects.push(new Project(projectJson.name, File.getDirectory(file)!));
                }
            }
        }

        return projects;
    }

    protected appendCLICompilerExtensions(context: ICommandContext): void {
        const extensionsArgument = context.parsedArguments.find(arg => arg.name === "--extensions" || arg.name === "-e");
        if (!ObjectExtensions.isNullOrUndefined(extensionsArgument) && extensionsArgument.values.length > 0)
            context.compilerExtensions.push(...extensionsArgument.values);
    }

    protected async getTransformersAsync(context: ICommandContext, program: typescript.Program):
        Promise<{
            before?: typescript.TransformerFactory<typescript.SourceFile>[];
            after?: typescript.TransformerFactory<typescript.SourceFile>[];
        }> {
        const extensionPromises = context.compilerExtensions.map(async (extensionPath) => {
            try {
                const extensionUrl = pathToFileURL(extensionPath).href;
                const module = await import(extensionUrl);

                if (module && typeof module.default?.getTransformers === "function")
                    return module.default.getTransformers(program);
                else {
                    Console.writeLineWarning(`Compiler extension at ${extensionPath} does not export a valid getTransformers function.`);
                    return { before: [], after: [] };
                }
            }
            catch (error: any) {
                Console.writeLineWarning(`Failed to load compiler extension at ${extensionPath}: ${error.message}`);
                return { before: [], after: [] };
            }
        });

        const results = await Promise.all(extensionPromises);

        return results.length === 0
            ? { before: [], after: [] }
            : { before: results.flatMap(result => result.before), after: results.flatMap(result => result.after) };
    }

    protected processDiagnostics(projectDescriptor: Project, diagnostics: typescript.Diagnostic[] | readonly typescript.Diagnostic[]): void {
        diagnostics.forEach(diagnostic => {
            let message = '';
            if (diagnostic.file) {
                const { line, character } = typescript.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
                message = `${projectDescriptor.name}: ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
            }
            else
                message = `${projectDescriptor.name}: ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;

            if (diagnostic.category === typescript.DiagnosticCategory.Error)
                Console.writeLineError(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Warning)
                Console.writeLineWarning(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Message)
                Console.writeLine(message);
        });
    }
}