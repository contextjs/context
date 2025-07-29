/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { Diagnostic, DiagnosticMessages, LanguageExtensions } from "@contextjs/views";
import { ParserResult } from "@contextjs/views-parser";
import { ServerCodeGenerator } from "./generators/server/server-code.generator.js";
import { ICodeGenerator } from "./interfaces/i-code.generator.js";
import { CompilationContext } from "./models/compilation-context.js";
import { CompiledView } from "./models/compiled-view{t}.js";

export class ViewsCompiler {
    private readonly context: CompilationContext;
    private readonly codeGenerator: ICodeGenerator | null = null;

    public constructor(context: CompilationContext) {
        this.context = context;
        this.codeGenerator = this.resolveCodeGenerator(context);
    }

    public async compileAllAsync(): Promise<CompiledView[]> {
        const results: CompiledView[] = [];

        for (const filePath of this.context.files)
            results.push(await this.compileFileAsync(filePath));

        return results;
    }

    public async compileFileAsync(filePath: string): Promise<CompiledView> {
        const projectType = this.context.project['type'];

        if (ObjectExtensions.isNullOrUndefined(this.codeGenerator)) {
            const parserResult = new ParserResult();
            parserResult.diagnostics.push(Diagnostic.error(DiagnosticMessages.UnsupportedProjectType(projectType)));

            return new CompiledView(filePath, projectType, parserResult, {});
        }

        if (this.context.files.length === 0 || this.context.files.indexOf(filePath) === -1) {
            const parserResult = new ParserResult();
            parserResult.diagnostics.push(Diagnostic.error(DiagnosticMessages.UnknownCompilationContextFile(filePath)));

            return new CompiledView(filePath, projectType, parserResult, {});
        }

        const fileExtension = File.getExtension(filePath) || StringExtensions.empty;
        const language = LanguageExtensions.fromString(fileExtension);

        if (StringExtensions.isNullOrWhitespace(fileExtension) || ObjectExtensions.isNullOrUndefined(language)) {
            const parserResult = new ParserResult();
            parserResult.diagnostics.push(Diagnostic.info(DiagnosticMessages.UnsupportedLanguage));

            return new CompiledView(filePath, projectType, parserResult, {});
        }

        return await this.codeGenerator.generateAsync(filePath, language);
    }

    private resolveCodeGenerator(context: CompilationContext): ICodeGenerator | null {
        const projectType = context.project['type'];

        switch (projectType) {
            case "server":
                return new ServerCodeGenerator(context);
            default:
                return null;
        }
    }
}