/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export enum SemanticTokenType {
    Comment = "comment",
    Equals = "equals",
    Literal = "literal",
    Quote = "quote",
    Transition = "transition",
    Trivia = "trivia",

    // HTML
    HtmlAttributeName = "htmlAttributeName",
    HtmlAttributeValue = "htmlAttributeValue",
    HtmlBracket = "htmlBracket",
    HtmlDoctype = "htmlDoctype",
    HtmlTagEnd = "htmlTagEnd",
    HtmlTagName = "htmlTagName",
    HtmlTagStart = "htmlTagStart",

    // CDATA
    CdataContent = "cdataContent",
    CdataEnd = "cdataEnd",
    CdataStart = "cdataStart",

    // Scripts
    ScriptAttributeName = "scriptAttributeName",
    ScriptAttributeValue = "scriptAttributeValue",
    ScriptContent = "scriptContent",
    ScriptTagEnd = "scriptTagEnd",
    ScriptTagName = "scriptTagName",
    ScriptTagStart = "scriptTagStart",

    // Style
    StyleAttributeName = "styleAttributeName",
    StyleAttributeValue = "styleAttributeValue",
    StyleContent = "styleContent",
    StyleTagEnd = "styleTagEnd",
    StyleTagName = "styleTagName",
    StyleTagStart = "styleTagStart",

    // Typescript
    TypescriptCodeBlock = "typescriptCodeBlock",
    TypescriptCodeBrace = "typescriptCodeBrace",
    TypescriptCodeExpression = "typescriptCodeExpression",
    TypescriptCodeValue = "typescriptCodeValue"
}

export const SEMANTIC_TOKEN_LEGEND: string[] = Object.values(SemanticTokenType);