/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { Location } from "@contextjs/views";
import { SEMANTIC_TOKEN_LEGEND, SemanticTokenType } from "./semantic-token-type.js";
import { SemanticToken } from "./semantic-token.js";

export class SemanticTokenContext {
    private tokens: SemanticToken[] = [];
    public readonly stateStack: Stack<SemanticTokenType> = new Stack<SemanticTokenType>();
    public readonly data: number[] = [];

    public clear(): void {
        this.tokens = [];
        this.stateStack.clear();
        this.data.length = 0;
    }

    public createToken(location: Location, type: SemanticTokenType): void {
        const legendIndex = SEMANTIC_TOKEN_LEGEND.indexOf(type);
        if (legendIndex < 0)
            return;

        for (const line of location.lines) {
            const length = line.endCharacterIndex - line.startCharacterIndex;
            if (length > 0) {
                this.tokens.push(new SemanticToken(
                    line.index,
                    line.startCharacterIndex,
                    length,
                    legendIndex
                ));
            }
        }
    }

    public getData() {
        let lastLine = 0, lastChar = 0;
        const data: number[] = [];
        for (const t of this.tokens) {
            const deltaLine = t.line - lastLine;
            const deltaChar = deltaLine === 0 ? t.char - lastChar : t.char;
            data.push(deltaLine, deltaChar, t.length, t.type, t.modifiersBitset);
            lastLine = t.line;
            lastChar = t.char;
        }

        this.data.length = 0;
        this.data.push(...data);
    }
}