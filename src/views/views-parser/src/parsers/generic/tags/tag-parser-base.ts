/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { DiagnosticMessages } from "@contextjs/views";
import { ParserContext } from "../../../context/parser-context.js";
import { EndOfFileSyntaxNode } from "../../../syntax/common/end-of-file-syntax-node.js";

export class TagParserBase {
    protected static tagNameStopPredicate(context: ParserContext): boolean {
        const stopChars = new Set(['=', '/', '>', '"', "'", " ", '<']);
        return stopChars.has(context.currentCharacter) || StringExtensions.containsOnlyWhitespace(context.currentCharacter);
    }

    protected static getTagName(context: ParserContext): string {
        const elementName = context.peekWhile((char) =>
            char !== '>' &&
            char !== '/' &&
            char !== ' ' &&
            char !== '=' &&
            char !== EndOfFileSyntaxNode.endOfFile
        );

        if (StringExtensions.isNullOrWhitespace(elementName)) {
            context.addErrorDiagnostic(DiagnosticMessages.UnexpectedEndOfInput);
            return StringExtensions.empty;
        }

        if (!this.isValidTag(`<${elementName}>`)) {
            context.addErrorDiagnostic(DiagnosticMessages.InvalidTagName(elementName));
            return StringExtensions.empty;
        }

        return elementName;
    }

    protected static isValidTag(tagText: string): boolean {
        const trimmed = tagText.trim();
        if (!trimmed.startsWith("<") || !trimmed.endsWith(">"))
            return false;

        if (trimmed.startsWith("</"))
            return false;

        let tagBody = trimmed.slice(1, -1);

        if (tagBody.length === 0 || tagBody[0] === " " || tagBody[0] === "\t")
            return false;

        const tagName = tagBody.split(/[\s\/>]/)[0];

        return /^[@\p{L}\p{So}_:][\p{L}\p{N}\p{So}\-.:_@]*$/u.test(tagName);
    }
}