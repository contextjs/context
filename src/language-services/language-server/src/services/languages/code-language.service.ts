/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { CompletionList, Position, TextDocumentPositionParams } from 'vscode-languageserver/node.js';

import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import { CodeValueSyntaxNode } from '@contextjs/views-parser';
import { ServerContext } from '../../models/server-context.js';
import { SemanticToken } from "../../visitors/semantics/semantic-token.js";
import { ILanguageService } from "./interfaces/i-language.service.js";

export class CodeLanguageService implements ILanguageService {
    private virtualFileName = 'virtual.ts';
    private currentCode = StringExtensions.empty;
    private version = 0;
    private host: typescript.LanguageServiceHost;
    private typescriptLanguageService: typescript.LanguageService;

    public context: ServerContext;

    public constructor(context: ServerContext) {
        this.context = context;
        this.host = this.createTypescriptHost();
        this.typescriptLanguageService = typescript.createLanguageService(this.host);
    }

    private createTypescriptHost(): typescript.LanguageServiceHost {
        return {
            getScriptSnapshot: (fileName) => { return fileName === this.virtualFileName ? typescript.ScriptSnapshot.fromString(this.currentCode) : undefined; },
            readFile: (fileName) => fileName === this.virtualFileName ? this.currentCode : undefined,
            getCompilationSettings: () => ({}),
            getScriptFileNames: () => [this.virtualFileName],
            getScriptVersion: () => this.version.toString(),
            getScriptKind: () => typescript.ScriptKind.TS,
            getCurrentDirectory: () => "",
            getDefaultLibFileName: () => "lib.d.ts",
            fileExists: () => true,
        };
    }

    public getRegion(position: Position): CodeValueSyntaxNode | null {
        if (ObjectExtensions.isNullOrUndefined(this.context.document))
            return null;

        const docOffset = this.context.document.offsetAt(position);

        for (const region of this.context.codeRegions) {
            if (region.location.absoluteStartCharacterIndex <= docOffset && docOffset <= region.location.absoluteEndCharacterIndex)
                return region;
        }

        return null;
    }

    public complete(position: TextDocumentPositionParams, region: CodeValueSyntaxNode): CompletionList {
        const document = this.context.documentsService.documents.get(position.textDocument.uri);

        if (ObjectExtensions.isNullOrUndefined(region) || ObjectExtensions.isNullOrUndefined(document))
            return { isIncomplete: false, items: [] };

        return CompletionList.create([]);
    }

    public getSemanticTokens(node: CodeValueSyntaxNode): SemanticToken[] {
        if (StringExtensions.isNullOrWhitespace(node.value))
            return [];

        const tokens: SemanticToken[] = [];

        for (const line of node.location.lines) {
            if (StringExtensions.isNullOrWhitespace(line.text))
                continue;

            this.currentCode = line.text;
            this.version++;

            const result = this.typescriptLanguageService.getEncodedSyntacticClassifications(
                this.virtualFileName,
                { start: 0, length: line.text.length }
            );

            if (result?.spans?.length > 0) {
                for (let i = 0; i < result.spans.length; i += 3) {
                    const start = result.spans[i] + line.startCharacterIndex;
                    const length = result.spans[i + 1];
                    const encodedType = result.spans[i + 2] & 0xFF;
                    const tokenText = line.text.slice(start, start + length);
                    const tokenType = this.tsTokenTypeToLegendIndex(encodedType);

                    if (ObjectExtensions.isNullOrUndefined(tokenType))
                        continue;

                    tokens.push(new SemanticToken(
                        line.index,
                        start,
                        length,
                        tokenType,
                        tokenText,
                        line.endCharacterIndex
                    ));
                }
            }
        }

        return tokens;
    }

    private tsTokenTypeToLegendIndex(tsTokenType: number): number | undefined {
        const map: Record<number, number> = {
            20: 0,
            11: 1,
            16: 2,
            21: 3,
            17: 4,
            22: 5,
            13: 6,
            2: 7,
            14: 8,
            15: 9,
            23: 10,
            18: 11,
            19: 12,
            24: 13,
            3: 14,
            25: 15,
            27: 16,
            6: 17,
            4: 18,
            30: 19,
            5: 20,
            8: 20,
            10: 20,
        };
        return map[tsTokenType];
    }

}