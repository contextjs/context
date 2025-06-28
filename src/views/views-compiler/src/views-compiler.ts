/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { DiagnosticMessages } from "@contextjs/views";
import { Language, LanguageExtensions, Parser } from "@contextjs/views-parser";
import { CodeGenerator } from "./code.generator.js";
import type { ICompilationContext } from "./interfaces/i-compilation-context.js";
import { ICompiledView } from "./interfaces/i-compiled-view.js";
import { IViewsCompilerOptions } from "./interfaces/i-views-compiler-options.js";
import { Diagnostic } from "./models/diagnostic.js";
import { GeneratorContext } from "./models/generator-context.js";
import { SourceMapWriter } from "./source-map-writer.js";

export class ViewsCompiler {
    private readonly context: ICompilationContext;
    private readonly options: IViewsCompilerOptions;

    public constructor(context: ICompilationContext, options: IViewsCompilerOptions) {
        this.context = context;
        this.options = options;
    }

    public async compileFile(filePath: string): Promise<ICompiledView> {
        const diagnostics: Diagnostic[] = [];
        const fileContent = await this.context.getFileContent(filePath);
        const fileExtension = File.getExtension(filePath) || StringExtensions.empty;
        const language = LanguageExtensions.fromString(fileExtension);

        if (StringExtensions.isNullOrWhitespace(fileExtension) || ObjectExtensions.isNullOrUndefined(language))
            diagnostics.push(Diagnostic.info(DiagnosticMessages.UnsupportedLanguage, filePath));

        const parserResult = Parser.parse(fileContent, language ?? Language.TSHTML);
        diagnostics.push(...parserResult.diagnostics.map(parserDiagnostic => new Diagnostic(parserDiagnostic, filePath)));

        const className = this.getClassNameFromFilePath(filePath);
        const generatedFileName = `${className}.ts`;
        const sourceMap = new SourceMapWriter(generatedFileName);
        sourceMap.setSourceContent(filePath, fileContent);

        const context = new GeneratorContext(parserResult, filePath, sourceMap);
        const generatedCode = CodeGenerator.generate(context);

        const esmSource =
            `export default class ${className} {
    public static metadata = { filePath: ${JSON.stringify(filePath)} };
    public async renderAsync(model) {
${generatedCode}
    }
}
const __sourcemap = ${sourceMap.toString()};`;

        return { filePath, className, esmSource, esmSourceMap: sourceMap.toString(), diagnostics };
    }

    public async compileAll(): Promise<ICompiledView[]> {
        const results: ICompiledView[] = [];

        for (const filePath of this.options.files)
            results.push(await this.compileFile(filePath));

        return results;
    }

    private getClassNameFromFilePath(filePath: string): string {
        const normalizedFilePath = filePath.replace(/\\/g, "/");
        let projectRoot = this.options.projectRoot.replace(/\\/g, "/").replace(/\/+$/, "");

        let relative = normalizedFilePath;
        if (projectRoot && normalizedFilePath.startsWith(projectRoot + "/"))
            relative = normalizedFilePath.substring(projectRoot.length + 1);

        relative = relative.replace(/\.tshtml$/i, '');
        const segments = relative.split(/[/.\-_]+/);

        return segments.filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    }
}