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
import { createArrayAppendTransformer } from './typescript/array.transformer.ts';
import { createImportTransformer } from './typescript/import.transformer.ts';

export class Build extends Script {
    private readonly packageName: string = "di";
    private readonly contextTransformersPath = 'src/context/src/services/commands/build/transformers';
    private readonly transformers = [
        { className: "transientServiceTransformer", classPath: "transient-service.transformer" },
        { className: "singletonServiceTransformer", classPath: "singleton-service.transformer" }
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
                `src/${this.packageName}/scripts/transformers/${transformer.classPath}.ts`,
                `${this.contextTransformersPath}/${transformer.classPath}.ts`)
        }));
    }

    private async applyTransformersAsync(): Promise<void> {
        const transformers = this.transformers.map(transformer => {
            return createImportTransformer(transformer.className, `./${transformer.classPath}.js`);
        });
        const arrayAppenderTransformers = this.transformers.map(transformer =>
            createArrayAppendTransformer("transformers", [transformer.className])
        );

        const allTransformers = [
            ...this.transformers.map(t => createImportTransformer(t.className, `./${t.classPath}.js`)),
            ...this.transformers.map(t => createArrayAppendTransformer("transformers", [t.className]))
        ];

        const contextTransformerServicePath = `${this.contextTransformersPath}/transformers.service.ts`;
        const sourceText = File.read(contextTransformerServicePath);
        const sourceFile = typescript.createSourceFile(
            contextTransformerServicePath,
            sourceText!,
            typescript.ScriptTarget.Latest,
            true,
            typescript.ScriptKind.TS
        );

        const result = typescript.transform(sourceFile, allTransformers);
        const transformedSourceFile = result.transformed[0];

        const printer = typescript.createPrinter({ newLine: typescript.NewLineKind.LineFeed });
        const newSource = printer.printFile(transformedSourceFile);

        File.save(contextTransformerServicePath, newSource, true);
    }
}

await new Build().runAsync();