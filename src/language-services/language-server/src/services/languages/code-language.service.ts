/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { LanguageExtensions } from '@contextjs/views';
import { CodeValueSyntaxNode } from '@contextjs/views-parser';
import { CompletionList, TextDocumentPositionParams } from 'vscode-languageserver';
import { ServerContext } from '../../models/server-context.js';
import { SemanticToken } from '../../visitors/semantics/semantic-token.js';
import { ICodeLanguageService } from './interfaces/i-code-language.service.js';
import { TypescriptLanguageService } from "./typescript-language.service.js";

export class CodeLanguageService {
    private typescriptLanguageService: TypescriptLanguageService;
    private service: ICodeLanguageService;

    public constructor(context: ServerContext) {
        this.typescriptLanguageService = new TypescriptLanguageService(context);
        this.service = this.typescriptLanguageService;
    }

    public setLanguage(languageName: string): void {
        const language = LanguageExtensions.fromString(languageName);

        switch (language) {
            default:
                this.service = this.typescriptLanguageService;
        }
    }

    public complete(position: TextDocumentPositionParams, ...parameters: any[]): CompletionList {
        return this.service.complete(position, ...parameters);
    }

    public getSemanticTokens(node: CodeValueSyntaxNode): SemanticToken[] {
        return this.service.getSemanticTokens(node);
    }

    public getRegion(position: TextDocumentPositionParams): CodeValueSyntaxNode | null {
        return this.service.getRegion(position.position);
    }
}