/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import typescript from 'typescript';
import Script from '../../../scripts/script.ts';
import { addImportTransformer } from './typescript/add-import.transformer.ts';
import { appendToArrayTransformer } from './typescript/append-to-array.transformer.ts';
import { serviceLifetimeTransformer } from './typescript/service-lifetime.transformer.ts';

export class Build extends Script {
    private readonly packageName: string = "di";
    private readonly contextTransformersPath = 'src/context/src/services/commands/transformers';
    private readonly transformers = [
        { className: "serviceCollectionTransformer", classFile: "service-collection.transformer" },
        { className: "serviceResolverTransformer", classFile: "service-resolver.transformer" }
    ];

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageName);
        await this.copyReadmeFileAsync(this.packageName);
        await this.executeCommandAsync(`cd src/${this.packageName} && tsc`);
        await this.copyTranformerFilesAsync();
        await this.applyTransformersAsync();
    }

    private async copyTranformerFilesAsync(): Promise<void> {
        await Promise.all(this.transformers.map(async (transformer) => {
            await this.copyFileAsync(
                `src/${this.packageName}/scripts/transformers/${transformer.classFile}.ts`,
                `${this.contextTransformersPath}/${transformer.classFile}.ts`)
        }));
    }

    private async applyTransformersAsync(): Promise<void> {
        const contextTransformerServicePath = `${this.contextTransformersPath}/transformers.service.ts`;
        const sourceText = File.read(contextTransformerServicePath);
        const sourceFile = typescript.createSourceFile(
            contextTransformerServicePath,
            sourceText!,
            typescript.ScriptTarget.Latest,
            true,
            typescript.ScriptKind.TS
        );

        const importTransformers = this.transformers.map(transformer => {
            return addImportTransformer(transformer.className, `./${transformer.classFile}.js`);
        });

        const codeTransformers = [
            serviceLifetimeTransformer({ addTransient: "transient", addSingleton: "singleton" }),
            appendToArrayTransformer("transformers", ['serviceResolverTransformer']),
        ];

        const result = typescript.transform(sourceFile, [...importTransformers, ...codeTransformers]);
        const transformedSourceFile = result.transformed[0];

        const printer = typescript.createPrinter({ newLine: typescript.NewLineKind.LineFeed });
        const newSource = printer.printFile(transformedSourceFile);

        File.save(contextTransformerServicePath, newSource, true);
    }
}

await new Build().runAsync();