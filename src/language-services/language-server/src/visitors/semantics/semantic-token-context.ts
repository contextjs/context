/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */


import { Stack } from "@contextjs/collections";
import { CodeValueSyntaxNode, LocationSyntaxNode } from "@contextjs/views-parser";
import { ServerContext } from "../../models/server-context.js";
import { SEMANTIC_TOKEN_LEGEND, SyntaxNodeType } from "../../models/syntax-node-type.js";
import { SemanticToken } from "./semantic-token.js";

export class SemanticTokenContext {
    private serverContext: ServerContext;
    private tokens: SemanticToken[] = [];

    public readonly state: Stack<SyntaxNodeType> = new Stack<SyntaxNodeType>();

    public constructor(serverContext: ServerContext) {
        this.serverContext = serverContext;
    }

    public reset(): void {
        this.tokens = [];
        this.state.clear();
    }

    public createToken(node: LocationSyntaxNode, type: SyntaxNodeType): void {
        if (node instanceof CodeValueSyntaxNode) {
            const tokens = this.serverContext.codeLanguageService.getSemanticTokens(node)
            if (tokens.length > 0)
                this.tokens.push(...tokens);

            return;
        }

        const legendIndex = SEMANTIC_TOKEN_LEGEND.indexOf(type);
        if (legendIndex < 0)
            return;

        for (const line of node.location.lines) {
            const length = line.endCharacterIndex - line.startCharacterIndex;
            if (length > 0) {
                this.tokens.push(new SemanticToken(
                    line.index,
                    line.startCharacterIndex,
                    length,
                    legendIndex,
                    line.text,
                    line.endCharacterIndex
                ));
            }
        }
    }

    public getData(): number[] {
        let lastLineIndex = 0;
        let lastCharacterIndex = 0;
        const data: number[] = [];

        for (const token of this.tokens) {
            const lineDelta = token.lineIndex - lastLineIndex;
            const characterDelta = lineDelta === 0 ? token.characterIndex - lastCharacterIndex : token.characterIndex;
            data.push(lineDelta, characterDelta, token.length, token.type, token.modifiersBitset);

            lastLineIndex = token.lineIndex;
            lastCharacterIndex = token.characterIndex;
        }

        return data;
    }
}