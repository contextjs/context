/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler, ICompilerExtension } from "@contextjs/compiler";
import { Directory } from "@contextjs/io";
import { Console, ObjectExtensions } from "@contextjs/system";
import path from "node:path";
import { pathToFileURL } from "node:url";

export class ExtensionsResolver {
    private static transformersFolder = path.join(import.meta.dirname, "../transformers");
    private static registered = false;

    public static async resolveAsync(transformers: string[], projectPath: string): Promise<ICompilerExtension[]> {
        const resolvedExtensions: ICompilerExtension[] = [];
        if (ObjectExtensions.isNullOrUndefined(transformers) || transformers.length === 0)
            return resolvedExtensions;

        for (const transformer of transformers) {
            const modulePath = transformer.startsWith(".")
                ? pathToFileURL(path.resolve(projectPath, transformer)).href
                : transformer;

            try {
                const importedModule = await import(modulePath);
                const extension: ICompilerExtension = importedModule.default ?? importedModule;

                if (extension?.name && typeof extension.getTransformers === "function")
                    resolvedExtensions.push(extension);
                else
                    Console.writeLineError(`Invalid transformer: ${transformer}`);
            }
            catch (error) {
                Console.writeLineError(`Failed to load transformer "${transformer}": ${error}`);
            }
        }

        return resolvedExtensions;
    }

    public static async registerAsync(): Promise<void> {
        if (this.registered)
            return;

        this.registered = true;

        if (!Directory.exists(this.transformersFolder))
            return;

        const files = Directory
            .listFiles(this.transformersFolder)
            .filter(file => file.endsWith(".js"))
            .sort();

        for (const file of files)
            await this.loadAsync(file);
    }

    private static async loadAsync(filePath: string): Promise<void> {
        try {
            const module = await import(pathToFileURL(filePath).href);
            const extension = module.default as ICompilerExtension;

            if (extension?.name && typeof extension.getTransformers === "function")
                Compiler.registerExtension(extension);
        }
        catch (error) {
            Console.writeLineError(`Failed to load transformer "${filePath}": ${error}`);
        }
    }
}