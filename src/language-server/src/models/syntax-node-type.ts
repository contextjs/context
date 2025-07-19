/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export enum SyntaxNodeType {
    Comment = "comment",
    Equals = "equals",
    Literal = "literal",
    Quote = "quote",
    Transition = "transition",
    Trivia = "trivia",

    HtmlAttributeName = "htmlAttributeName",
    HtmlAttributeValue = "htmlAttributeValue",
    HtmlBracket = "htmlBracket",
    HtmlDoctype = "htmlDoctype",
    HtmlTagEnd = "htmlTagEnd",
    HtmlTagName = "htmlTagName",
    HtmlTagStart = "htmlTagStart",

    CdataContent = "cdataContent",
    CdataEnd = "cdataEnd",
    CdataStart = "cdataStart",

    ScriptAttributeName = "scriptAttributeName",
    ScriptAttributeValue = "scriptAttributeValue",
    ScriptContent = "scriptContent",
    ScriptTagEnd = "scriptTagEnd",
    ScriptTagName = "scriptTagName",
    ScriptTagStart = "scriptTagStart",

    StyleAttributeName = "styleAttributeName",
    StyleAttributeValue = "styleAttributeValue",
    StyleContent = "styleContent",
    StyleTagEnd = "styleTagEnd",
    StyleTagName = "styleTagName",
    StyleTagStart = "styleTagStart",

    TypescriptCodeBlock = "typescriptCodeBlock",
    TypescriptCodeBrace = "typescriptCodeBrace",
    TypescriptCodeExpression = "typescriptCodeExpression",
    TypescriptCodeValue = "typescriptCodeValue"
}

export const SEMANTIC_TOKEN_LEGEND: string[] = Object.values(SyntaxNodeType);