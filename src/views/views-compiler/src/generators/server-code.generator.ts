/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "../extensions/syntax-node-extension-imports.js";

import { StringExtensions } from "@contextjs/system";
import { ICodeGenerator } from "../interfaces/i-code.generator.js";
import { CompilationContext } from "../models/compilation-context.js";

import { Language } from "@contextjs/views";
import { Parser } from "@contextjs/views-parser";
import { GeneratorContext } from "../models/generator-context.js";
import { CompiledView } from "../models/views/compiled-view{t}.js";
import { ServerCompiledViewData } from "../models/views/server-compiled-view-data.js";
import { NoopSourceMapWriter } from "../no-op-source-map-writer.js";
import { SourceMapWriter } from "../source-map-writer.js";

export class ServerCodeGenerator implements ICodeGenerator {
    private readonly context: CompilationContext;

    public constructor(compilationContext: CompilationContext) {
        this.context = compilationContext;
    }

    public async generateAsync(filePath: string, language: Language): Promise<CompiledView<ServerCompiledViewData>> {
        const fileContent = await this.context.getFileContentAsync(filePath);
        const className = this.getClassNameFromFilePath(filePath);
        const generatedFileName = `${className}.ts`;

        const sourceMapWriter = this.context.generateSourceMap
            ? new SourceMapWriter(generatedFileName)
            : new NoopSourceMapWriter();
        sourceMapWriter.setSourceContent(filePath, fileContent);

        const parserResult = Parser.parse(fileContent, language);
        const generatorContext = new GeneratorContext(parserResult, filePath, fileContent, sourceMapWriter);

        let source =
            `import { ServerView } from "@contextjs/views";

export default class ${className} extends ServerView {
    public static metadata = { filePath: ${JSON.stringify(filePath)} };

    public async renderAsync(model): Promise<string> {
{0}
        return this.getOutput();
    }
}`;

        for (const node of generatorContext.parserResult.nodes)
            node.generate(generatorContext);

        generatorContext.flushPendingLiteral();

        const sourceMap = this.context.generateSourceMap
            ? StringExtensions.format(`\nconst __sourcemap = {0};`, sourceMapWriter.toString())
            : null;

        source = StringExtensions.format(source, generatorContext.valueBuilder.toString());

        if (!StringExtensions.isNullOrWhitespace(sourceMap))
            source += `\n${sourceMap}`;

        return new CompiledView<ServerCompiledViewData>(
            filePath,
            "server",
            parserResult.diagnostics,
            new ServerCompiledViewData(source, sourceMap, className, generatedFileName),
        );
    }

    private getClassNameFromFilePath(filePath: string): string {
        const normalizedFilePath = filePath.replace(/\\/g, "/");
        let projectRoot = this.context.projectRoot.replace(/\\/g, "/").replace(/\/+$/, "");

        let relative = normalizedFilePath;
        if (projectRoot && normalizedFilePath.startsWith(projectRoot + "/"))
            relative = normalizedFilePath.substring(projectRoot.length + 1);

        relative = relative.replace(/\.tshtml$/i, '');
        const segments = relative.split(/[/.\-_]+/);

        return segments.filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    }
}