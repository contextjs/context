/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler, ICompilerExtension } from "@contextjs/compiler";
import { Directory } from "@contextjs/io";
import { Console } from "@contextjs/system";
import path from "path";
import { pathToFileURL } from "url";

export class ExtensionsRegistrar {
    private readonly transformersFolder: string;
    private static registered = false;

    public constructor(transformersFolder?: string) {
        this.transformersFolder = transformersFolder ??
            path.join(import.meta.dirname, "../transformers");
    }

    public async registerAsync(): Promise<void> {
        if (ExtensionsRegistrar.registered)
            return;

        ExtensionsRegistrar.registered = true;

        if (!Directory.exists(this.transformersFolder))
            return;

        const files = Directory
            .listFiles(this.transformersFolder)
            .filter(file => file.endsWith(".js"))
            .sort();

        for (const file of files)
            await this.loadExtensionAsync(file);
    }

    private async loadExtensionAsync(filePath: string): Promise<void> {
        try {
            const module = await import(pathToFileURL(filePath).href);
            const extension = module.default as ICompilerExtension;

            if (!extension?.name || typeof extension.getTransformers !== "function")
                return;

            Compiler.registerExtension(extension);
        }
        catch {
            Console.writeLineError(`Failed to load transformer: ${filePath}`);
        }
    }
}