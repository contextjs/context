/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "./index.ts";

//#region Abstracts

/**
* The LocationSyntaxNode class is an abstract base class representing a node in the syntax tree with a source location.
 */
export declare abstract class LocationSyntaxNode extends SyntaxNode {
    /**
     * The location in the source file where the node is found.
     */
    public location: Location;
}

/**
 * The SyntaxNode class is an abstract base class representing a node in the syntax tree.
 */
export declare abstract class SyntaxNode {
    /**
     * The suffix node that follows this node.
     */
    public suffix: SyntaxNode | null;
}

/**
 * The ValueSyntaxNode class is an abstract class that extends the SyntaxNode class.
 * It represents a syntax node that contains a text value and provides common functionality for text-based nodes.
 */
export declare abstract class ValueSyntaxNode extends LocationSyntaxNode {

    /**
     * The value content associated with this syntax node.
     */
    public readonly value: string;
}

//#endregion

//#region HTML

//#region Attributes

/**
 * The AttributeNameSyntaxNode class represents the name of an attribute in the syntax tree.
 */
export declare class AttributeNameSyntaxNode extends ValueSyntaxNode { }

/**
 * The AttributeSyntaxNode class represents an attribute in the syntax tree.
 */
export declare class AttributeSyntaxNode extends SyntaxNode {
    /**
     * The name of the attribute.
     */
    public name: SyntaxNode;

    /**
     * The assignment node if present.
     */
    public assignment: SyntaxNode | null;

    /**
     * The start quote of the attribute value if present.
     */
    public startQuote: SyntaxNode | null;

    /**
     * The value of the attribute if present.
     */
    public value: SyntaxNode | null;

    /**
     * The end quote of the attribute value if present.
     */
    public endQuote: SyntaxNode | null;

    /**
     * Constructs a new AttributeSyntaxNode instance.
     * 
     * @param {SyntaxNode} name - The name of the attribute.
     * @param {SyntaxNode | null} assignment - The assignment node if present.
     * @param {SyntaxNode | null} startQuote - The start quote of the attribute value if present.
     * @param {SyntaxNode | null} value - The value of the attribute if present.
     * @param {SyntaxNode | null} endQuote - The end quote of the attribute value if present.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the attribute.
     */
    public constructor(
        name: SyntaxNode,
        assignment: SyntaxNode | null,
        startQuote: SyntaxNode | null,
        value: SyntaxNode | null,
        endQuote: SyntaxNode | null,
        suffix: SyntaxNode | null);
}

/**
 * The AttributeValueSyntaxNode class represents the value of an attribute in the syntax tree.
 */
export declare class AttributeValueSyntaxNode extends ValueSyntaxNode { }

//#endregion

//#region CDATA

/**
 * The CDATAContentSyntaxNode class represents the content of a CDATA section in the syntax tree.
 */
export declare class CDATAContentSyntaxNode extends ValueSyntaxNode { }

/**
 * The CDATAEndSyntaxNode class represents the end of a CDATA section in the syntax tree.
 */
export declare class CDATAEndSyntaxNode extends ValueSyntaxNode { }

/**
 * The CDATAStartSyntaxNode class represents the start of a CDATA section in the syntax tree.
 */
export declare class CDATAStartSyntaxNode extends ValueSyntaxNode { }

/**
 * The CDATASyntaxNode class represents a CDATA section in the syntax tree.
 */
export declare class CDATASyntaxNode extends SyntaxNode {
    /**
     * The start node of the CDATA section.
     */
    public start: SyntaxNode;

    /**
     * The content node of the CDATA section.
     */
    public content: SyntaxNode;

    /**
     * The end node of the CDATA section.
     */
    public end: SyntaxNode;

    /**
     * Constructs a new CDATASyntaxNode instance.
     * 
     * @param {SyntaxNode} start - The start node of the CDATA section.
     * @param {SyntaxNode} content - The content node of the CDATA section.
     * @param {SyntaxNode} end - The end node of the CDATA section.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the CDATA section.
     */
    constructor(start: SyntaxNode, content: SyntaxNode, end: SyntaxNode, suffix: SyntaxNode | null);
}

//#endregion

//#region Scripts

/**
 * The ScriptContentSyntaxNode class represents the content of a script element in the syntax tree.
 */
export declare class ScriptContentSyntaxNode extends ValueSyntaxNode { }

/**
 * The ScriptEndSyntaxNode class represents the end of a script element in the syntax tree.
 */
export declare class ScriptEndSyntaxNode extends ValueSyntaxNode { }

/**
 * The ScriptStartSyntaxNode class represents the start of a script element in the syntax tree.
 */
export declare class ScriptStartSyntaxNode extends ValueSyntaxNode { }

/**
 * The ScriptSyntaxNode class represents a script element in the syntax tree.
 */
export declare class ScriptSyntaxNode extends SyntaxNode {
    /**
     * The start node of the script element.
     */
    public start: SyntaxNode;

    /**
     * The content node of the script element.
     */
    public content: SyntaxNode;

    /**
     * The end node of the script element.
     */
    public end: SyntaxNode;

    /**
     * Constructs a new ScriptSyntaxNode instance.
     * 
     * @param {SyntaxNode} start - The start node of the script element.
     * @param {SyntaxNode} content - The content node of the script element.
     * @param {SyntaxNode} end - The end node of the script element.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the script element.
     */
    constructor(start: SyntaxNode, content: SyntaxNode, end: SyntaxNode, suffix: SyntaxNode | null);
}

//#endregion

//#region Styles

/**
 * The StyleContentSyntaxNode class represents the content of a style element in the syntax tree.
 */
export declare class StyleContentSyntaxNode extends ValueSyntaxNode { }

/**
 * The StyleEndSyntaxNode class represents the end of a style element in the syntax tree.
 */
export declare class StyleEndSyntaxNode extends ValueSyntaxNode { }

/**
 * The StyleStartSyntaxNode class represents the start of a style element in the syntax tree.
 */
export declare class StyleStartSyntaxNode extends ValueSyntaxNode { }

/**
 * The StyleSyntaxNode class represents a style element in the syntax tree.
 */
export declare class StyleSyntaxNode extends SyntaxNode {
    /**
     * The start node of the style element.
     */
    public start: SyntaxNode;

    /**
     * The content node of the style element.
     */
    public content: SyntaxNode;

    /**
     * The end node of the style element.
     */
    public end: SyntaxNode;

    /**
     * Constructs a new StyleSyntaxNode instance.
     * 
     * @param {SyntaxNode} start - The start node of the style element.
     * @param {SyntaxNode} content - The content node of the style element.
     * @param {SyntaxNode} end - The end node of the style element.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the style element.
     */
    constructor(start: SyntaxNode, content: SyntaxNode, end: SyntaxNode, suffix: SyntaxNode | null);
}

//#endregion

/**
 * The HtmlBracketSyntaxNode class represents a bracket in the syntax tree.
 */
export declare class HtmlBracketSyntaxNode extends ValueSyntaxNode { }

/**
 * The HtmlQuoteSyntaxNode class represents a quote in the syntax tree.
 */
export declare class HtmlQuoteSyntaxNode extends ValueSyntaxNode { }

/**
 * The HtmlTagNameSyntaxNode class represents the name of an HTML tag in the syntax tree.
 */
export declare class HtmlTagNameSyntaxNode extends ValueSyntaxNode { }

/**
 * The HtmlTagSyntaxNode class represents an HTML tag in the syntax tree.
 */
export declare class HtmlTagSyntaxNode extends SyntaxNode {
    /**
     * The name of the tag.
     */
    public name: string;

    /**
     * Indicates if the tag is self-closing.
     */
    public selfClosing: boolean;

    /**
     * The start tag node.
     */
    public startTag: SyntaxNode;

    /**
     * An array of child nodes that make up the content of the tag.
     */
    public children: SyntaxNode[];

    /**
     * The end tag node if present
     */
    public endTag: SyntaxNode | null;

    /**
     * Constructs a new HtmlTagSyntaxNode instance.
     * 
     * @param {SyntaxNode} startTag - The start tag node.
     * @param {SyntaxNode[]} children - An array of child nodes that make up the content of the tag.
     * @param {SyntaxNode | null} endTag - The end tag node if present.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the tag.
     */
    constructor(startTag: SyntaxNode, children: SyntaxNode[], endTag: SyntaxNode | null, suffix: SyntaxNode | null);
}

//#endregion

//#region TSHTML

/**
 * The BodySyntaxNode class represents the body of a layout in the syntax tree.
 */
export declare class BodySyntaxNode extends LocationSyntaxNode { }

/**
 * The BraceSyntaxNode class represents a brace in the syntax tree.
 */
export declare class BraceSyntaxNode extends ValueSyntaxNode { }

/**
 * The CodeSyntaxNode class represents a code block in the syntax tree.
 */
export declare class CodeSyntaxNode extends TypescriptSyntaxNode {

    /**
     * The code keyword node
     */
    public codeKeyword: SyntaxNode;

    /**
     * Constructs a new CodeSyntaxNode instance.
     * 
     * @param {SyntaxNode} transition - The transition node.
     * @param {SyntaxNode} codeKeyword - The code keyword node.
     * @param {SyntaxNode} openBrace - The open brace node.
     * @param {SyntaxNode} value - The value node.
     * @param {SyntaxNode} closeBrace - The close brace node.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the code block.
     */
    constructor(transition: SyntaxNode, codeKeyword: SyntaxNode, openBrace: SyntaxNode, value: SyntaxNode, closeBrace: SyntaxNode, suffix: SyntaxNode | null);
}

/**
 * The CommentSyntaxNode class represents a comment in the syntax tree.
 */
export declare class CommentSyntaxNode extends ValueSyntaxNode { }

/**
 * The KeywordSyntaxNode class represents a keyword in the syntax tree.
 */
export declare class KeywordSyntaxNode extends ValueSyntaxNode { }

/**
 * The TransitionSyntaxNode class represents the transition symbol in the syntax tree.
 */
export declare class TransitionSyntaxNode extends LocationSyntaxNode { }

//#endregion

//#region TypeScript

/**
 * The InlineTypescriptSyntaxNode class represents an inline TypeScript block in the syntax tree.
 */
export declare class InlineTypescriptSyntaxNode extends SyntaxNode {
    /**
     * The transition node.
     */
    public transition: SyntaxNode;

    /**
     * The value node.
     */
    public value: SyntaxNode;

    /**
     * Constructs a new InlineTypescriptSyntaxNode instance.
     * 
     * @param {SyntaxNode} transition - The transition node.
     * @param {SyntaxNode} value - The value node.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the inline TypeScript block.
     */
    constructor(transition: SyntaxNode, value: SyntaxNode, suffix: SyntaxNode | null);
}

/**
 * The TypescriptSyntaxNode class represents a TypeScript block in the syntax tree.
 */
export declare class TypescriptSyntaxNode extends SyntaxNode {
    /**
     * The transition node.
     */
    public transition: SyntaxNode;

    /**
     * The open brace node.
     */
    public openBrace: SyntaxNode;

    /**
     * The value node.
     */
    public value: SyntaxNode;

    /**
     * The close brace node.
     */
    public closeBrace: SyntaxNode;

    /**
     * Constructs a new TypescriptSyntaxNode instance.
     * 
     * @param {SyntaxNode} transition - The transition node.
     * @param {SyntaxNode} openBrace - The open brace node.
     * @param {SyntaxNode} value - The value node.
     * @param {SyntaxNode} closeBrace - The close brace node.
     * @param {SyntaxNode | null} suffix - The suffix node that follows the TypeScript block.
     */
    constructor(transition: SyntaxNode, openBrace: SyntaxNode, value: SyntaxNode, closeBrace: SyntaxNode, suffix: SyntaxNode | null);
}

/**
 * The TypescriptValueSyntaxNode class represents a TypeScript value in the syntax tree.
 */
export declare class TypescriptValueSyntaxNode extends ValueSyntaxNode { }

//#endregion

/**
 * The CompositeSyntaxNode class represents a syntax node that contains multiple child nodes.
 */
export declare class CompositeSyntaxNode extends SyntaxNode {

    /**
     * An array of child syntax nodes that make up this composite node.
     */
    public readonly children: SyntaxNode[];

    /**
     * Constructs a new CompositeSyntaxNode instance.
     * 
     * @param {SyntaxNode[]} children - An array of child syntax nodes that make up this composite node.
     */
    public constructor(children: SyntaxNode[]);
}

/**
 * The EndOfFileSyntaxNode class represents the end of a file in the syntax tree.
 */
export declare class EndOfFileSyntaxNode extends LocationSyntaxNode {
    /**
     * The end of file character.
     */
    public static endOfFile: string;
}

/**
 * The LiteralSyntaxNode class represents a literal value in the syntax tree.
 */
export declare class LiteralSyntaxNode extends ValueSyntaxNode { }