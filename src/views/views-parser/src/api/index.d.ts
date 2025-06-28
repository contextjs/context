/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Diagnostic, Location } from "@contextjs/views";

/**
 * Represents the parser for the view templates.
 */
export declare class Parser {
    /**
     * Parses the given text as a view template in the specified language.
     * @param text The text to parse.
     * @param language The language of the view template.
     * @returns A ParserResult containing diagnostics and syntax nodes.
     */
    public static parse(text: string, language: Language): ParserResult;
}

export declare enum Language {
    TSHTML = 'tshtml'
}

/**
 * Represents the extensions available for different languages.
 */
export class LanguageExtensions {
    /**
     * Gets the Language enum value from a string.
     * @param value The string representation of the language.
     * @returns The Language enum value or null if the string does not match any language.
     */
    public static fromString(value: string): Language | null;
}

/**
 * Represents the result of parsing a view template.
 * Contains diagnostics and syntax nodes.
 */
export declare class ParserResult {
    /**
     * The diagnostics generated during parsing.
     */
    public diagnostics: Diagnostic[];
    /**
     * The syntax nodes representing the structure of the parsed view template.
     */
    public nodes: SyntaxNode[];
}

//#region Syntax Nodes

//#region Abstracts

//#region Attributes

export declare abstract class AttributeNameSyntaxNode extends NameSyntaxNode { }

export declare abstract class AttributeSyntaxNode extends CompositeSyntaxNode { }

export declare abstract class AttributeValueSyntaxNode extends CompositeSyntaxNode { }

//#endregion

//#region Code

export declare abstract class CodeExpressionSyntaxNode extends LocationSyntaxNode {
    public readonly transition: TransitionSyntaxNode;
    public readonly value: CodeValueSyntaxNode;

    public constructor(
        transition: TransitionSyntaxNode,
        value: CodeValueSyntaxNode,
        location: Location,
        leadingTrivia: TriviaSyntaxNode | null,
        trailingTrivia: TriviaSyntaxNode | null);
}

export declare abstract class CodeBlockSyntaxNode extends CompositeSyntaxNode {
    public readonly transition: TransitionSyntaxNode;
    public readonly openingBrace: BraceSyntaxNode
    public readonly closingBrace: BraceSyntaxNode;

    public constructor(
        transition: TransitionSyntaxNode,
        openingBrace: BraceSyntaxNode,
        children: SyntaxNode[],
        closingBrace: BraceSyntaxNode,
        leadingTrivia?: TriviaSyntaxNode | null,
        trailingTrivia?: TriviaSyntaxNode | null);
}

export declare abstract class CodeValueSyntaxNode extends ValueSyntaxNode { }

//#endregion

//#region Tags

export declare abstract class TagEndSyntaxNode extends CompositeSyntaxNode { }

export declare abstract class TagNameSyntaxNode extends NameSyntaxNode { }

export declare abstract class TagStartSyntaxNode extends CompositeSyntaxNode { }

export declare abstract class TagSyntaxNode extends CompositeSyntaxNode { }

//#endregion

export declare abstract class BraceSyntaxNode extends DelimiterSyntaxNode { }

export declare abstract class BracketSyntaxNode extends DelimiterSyntaxNode { }

export declare abstract class CompositeSyntaxNode extends SyntaxNode {
    public readonly children: SyntaxNode[];
    public constructor(children: SyntaxNode[], leadingTrivia: TriviaSyntaxNode | null, trailingTrivia: TriviaSyntaxNode | null);
}

export declare abstract class DelimiterSyntaxNode extends ValueSyntaxNode { }

export declare abstract class LocationSyntaxNode extends SyntaxNode {
    public readonly location: Location;
    public constructor(location: Location, leadingTrivia: TriviaSyntaxNode, trailingTrivia: TriviaSyntaxNode | null);
}

export declare abstract class NameSyntaxNode extends CompositeSyntaxNode { }

export declare abstract class SyntaxNode {
    public leadingTrivia: TriviaSyntaxNode | null;
    public trailingTrivia: TriviaSyntaxNode | null;
    public constructor(leadingTrivia: TriviaSyntaxNode | null, trailingTrivia: TriviaSyntaxNode | null);
}

export declare abstract class ValueSyntaxNode extends LocationSyntaxNode {
    public readonly value: string | null;
    public constructor(value: string | null, location: Location, leadingTrivia: TriviaSyntaxNode | null, trailingTrivia: TriviaSyntaxNode | null);
}

//#endregion

//#region Common

export declare class CommentSyntaxNode extends ValueSyntaxNode { }

export declare class EndOfFileSyntaxNode extends LocationSyntaxNode {
    public static readonly endOfFile: string;
    public constructor(location: Location, leadingTrivia: TriviaSyntaxNode | null);
}

export declare class EqualsSyntaxNode extends DelimiterSyntaxNode { }

export declare class LiteralSyntaxNode extends ValueSyntaxNode { }

export declare class QuoteSyntaxNode extends DelimiterSyntaxNode { }

export declare class TransitionSyntaxNode extends DelimiterSyntaxNode { }

export class TriviaSyntaxNode extends ValueSyntaxNode {
    public constructor(value: string | null, location: Location);
}

//#endregion

//#region Html

//#region Attributes

export declare class HtmlAttributeNameSyntaxNode extends AttributeNameSyntaxNode { }

export declare class HtmlAttributeSyntaxNode extends AttributeSyntaxNode { }

export declare class HtmlAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

//#endregion

//#region CDATA

export declare class CDATAContentSyntaxNode extends ValueSyntaxNode { }

export declare class CDATAEndSyntaxNode extends ValueSyntaxNode { }

export declare class CDATAStartSyntaxNode extends ValueSyntaxNode { }

export declare class CDATASyntaxNode extends SyntaxNode {
    public readonly start: SyntaxNode;
    public readonly content: SyntaxNode;
    public readonly end: SyntaxNode;
    constructor(start: SyntaxNode, content: SyntaxNode, end: SyntaxNode, leadingTrivia: TriviaSyntaxNode | null, trailingTrivia: TriviaSyntaxNode | null);
}

//#endregion

//#region Scripts

export declare class ScriptAttributeNameSyntaxNode extends AttributeNameSyntaxNode { }

export declare class ScriptAttributeSyntaxNode extends AttributeSyntaxNode { }

export declare class ScriptAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

export declare class ScriptContentSyntaxNode extends LiteralSyntaxNode { }

export declare class ScriptTagEndSyntaxNode extends TagEndSyntaxNode { }

export declare class ScriptTagNameSyntaxNode extends TagNameSyntaxNode { }

export declare class ScriptTagStartSyntaxNode extends TagStartSyntaxNode { }

export declare class ScriptTagSyntaxNode extends TagSyntaxNode { }

//#endregion

//#region Style

export declare class StyleAttributeNameSyntaxNode extends AttributeNameSyntaxNode { }

export declare class StyleAttributeSyntaxNode extends AttributeSyntaxNode { }

export declare class StyleAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

export declare class StyleContentSyntaxNode extends LiteralSyntaxNode { }

export declare class StyleTagEndSyntaxNode extends TagEndSyntaxNode { }

export declare class StyleTagNameSyntaxNode extends TagNameSyntaxNode { }

export declare class StyleTagStartSyntaxNode extends TagStartSyntaxNode { }

export declare class StyleTagSyntaxNode extends TagSyntaxNode { }

//#endregion

//#region Tags

export declare class HtmlTagEndSyntaxNode extends TagEndSyntaxNode { }

export declare class HtmlTagNameSyntaxNode extends TagNameSyntaxNode { }

export declare class HtmlTagStartSyntaxNode extends TagStartSyntaxNode { }

export declare class HtmlTagSyntaxNode extends TagSyntaxNode { }

//#endregion

export declare class HtmlBracketSyntaxNode extends BracketSyntaxNode { }

//#endregion

//#region Typescript

export declare class TypescriptCodeBlockSyntaxNode extends CodeBlockSyntaxNode { }

export declare class TypescriptCodeBraceSyntaxNode extends BraceSyntaxNode { }

export declare class TypescriptCodeExpressionSyntaxNode extends CodeExpressionSyntaxNode { }

export declare class TypescriptCodeValueSyntaxNode extends CodeValueSyntaxNode { }

//#endregion

//#endregion