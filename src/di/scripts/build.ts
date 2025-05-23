/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from 'node:path';
import type PackageInfo from '../../../scripts/package-info.ts';
import Script from '../../../scripts/script.ts';

export class Build extends Script {
    private readonly packageInfo: PackageInfo = { name: "di" };
    private targetDir = path.resolve("src", "context", "src", "transformers");

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageInfo);
        await this.copyReadmeFileAsync(this.packageInfo);
        await this.executeCommandAsync(`cd src/${this.packageInfo.name} && tsc`);
        await this.copyTransformersToContext();
        await this.generateCompilerExtension();
    }

    private async generateCompilerExtension(): Promise<void> {
        const file = `/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 *
 *
 * Auto-generated by @contextjs/di build script.
 */

import typescript from "typescript";
import { serviceCollectionTransformer } from "./service-collection.transformer.js";
import { serviceResolverTransformer } from "./service-resolver.transformer.js";
import { paramTypesRewriter } from "./metadata-type.transformer.js";

export default {
    name: "@contextjs/di",
    getTransformers(program: typescript.Program) {
        return {
            before: [
                serviceCollectionTransformer({
                    addSingleton: "singleton",
                    addTransient: "transient",
                    addScoped: "scoped"
                }, program),
                serviceResolverTransformer
            ],
            after: [paramTypesRewriter(program)]
        };
    }
};`;
        const outputPath = path.join(this.targetDir, "di-extension.ts");
        await this.writeFileAsync(outputPath, file);
    }

    private async copyTransformersToContext(): Promise<void> {

        await this.createDirectoryAsync(this.targetDir);

        await this.copyFileAsync(
            "src/di/scripts/transformers/service-collection.transformer.ts",
            path.join(this.targetDir, "service-collection.transformer.ts")
        );

        await this.copyFileAsync(
            "src/di/scripts/transformers/service-resolver.transformer.ts",
            path.join(this.targetDir, "service-resolver.transformer.ts")
        );

        await this.copyFileAsync(
            "src/di/scripts/transformers/metadata-type.transformer.ts",
            path.join(this.targetDir, "metadata-type.transformer.ts")
        );
    }
}

await new Build().runAsync();