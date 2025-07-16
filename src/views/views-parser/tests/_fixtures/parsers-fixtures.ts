/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserContext } from "../../src/context/parser-context";
import { CommentParser } from "../../src/parsers/common/comment.parser";
import { LiteralParser } from "../../src/parsers/common/literal.parser";
import { TransitionParser } from "../../src/parsers/common/transition.parser";
import { AttributeParser } from "../../src/parsers/generic/attribute.parser";
import { BraceParser } from "../../src/parsers/generic/brace.parser";
import { BracketParser } from "../../src/parsers/generic/bracket.parser";
import { CodeParser } from "../../src/parsers/generic/code/code.parser";
import { TagParser } from "../../src/parsers/generic/tags/tag.parser";
import { CDATAParser } from "../../src/parsers/html/cdata.parser";
import { AttributeSyntaxNode } from "../../src/syntax/abstracts/attributes/attribute-syntax-node";
import { AttributeValueSyntaxNode } from "../../src/syntax/abstracts/attributes/attribute-value-syntax-node";
import { BraceSyntaxNode } from "../../src/syntax/abstracts/brace-syntax-node";
import { BracketSyntaxNode } from "../../src/syntax/abstracts/bracket-syntax-node";
import { CodeBlockSyntaxNode } from "../../src/syntax/abstracts/code/code-block-syntax-node";
import { CodeExpressionSyntaxNode } from "../../src/syntax/abstracts/code/code-expression-syntax-node";
import { CodeValueSyntaxNode } from "../../src/syntax/abstracts/code/code-value-syntax-node";
import { NameSyntaxNode } from "../../src/syntax/abstracts/name-syntax-node";
import { SyntaxNode } from "../../src/syntax/abstracts/syntax-node";
import { TagEndSyntaxNode } from "../../src/syntax/abstracts/tags/tag-end-syntax-node";
import { TagNameSyntaxNode } from "../../src/syntax/abstracts/tags/tag-name-syntax-node";
import { TagStartSyntaxNode } from "../../src/syntax/abstracts/tags/tag-start-syntax-node";
import { TagSyntaxNode } from "../../src/syntax/abstracts/tags/tag-syntax-node";
import { EndOfFileSyntaxNode } from "../../src/syntax/common/end-of-file-syntax-node";

export class TestTagSyntaxNode extends TagSyntaxNode { }
export class TestTagNameSyntaxNode extends TagNameSyntaxNode { }
export class TestTagStartSyntaxNode extends TagStartSyntaxNode { }
export class TestTagEndSyntaxNode extends TagEndSyntaxNode { }

export class TestAttributeSyntaxNode extends AttributeSyntaxNode { }
export class TestAttributeNameSyntaxNode extends NameSyntaxNode { }
export class TestAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

export class TestCodeBlockSyntaxNode extends CodeBlockSyntaxNode { }
export class TestCodeValueSyntaxNode extends CodeValueSyntaxNode { }
export class TestCodeExpressionSyntaxNode extends CodeExpressionSyntaxNode { }

export class TestBraceSyntaxNode extends BraceSyntaxNode { }
export class TestBracketSyntaxNode extends BracketSyntaxNode { }

export class TestNode extends SyntaxNode { }
export class TestHeaderNode extends CodeValueSyntaxNode { }

export class TestParser {
    public static parse(context: ParserContext): SyntaxNode {
        switch (context.currentCharacter) {
            case EndOfFileSyntaxNode.endOfFile:
                return new EndOfFileSyntaxNode(context.getLocation());
            case TransitionParser.transitionSymbol:
                if (TransitionParser.isEscapedTransition(context))
                    return LiteralParser.parse(context);
                else
                    return TestCodeParser.parse(context);
            case '<':
                if (CommentParser.isCommentStart(context))
                    return CommentParser.parse(context);
                else if (CDATAParser.isCDATAStart(context))
                    return CDATAParser.parse(context);
                else
                    return TestTagParser.parse(context);
            case '/':
                if (CommentParser.isCommentStart(context))
                    return CommentParser.parse(context);
                else
                    return LiteralParser.parse(context);
            default:
                return LiteralParser.parse(context);
        }
    }
}

export class TestAttributeParser {
    public static parse(context: ParserContext): TestAttributeSyntaxNode {
        return AttributeParser.parse<TestAttributeSyntaxNode,
            TestAttributeNameSyntaxNode,
            TestAttributeValueSyntaxNode>(
                context,
                (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
                (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia)
            );
    }
}

export class TestTagParser {
    public static parse(context: ParserContext): TestTagSyntaxNode {
        const VOID_ELEMENTS = new Set([
            "area", "base", "br", "col", "embed", "hr", "img",
            "input", "link", "meta", "source", "track", "wbr"
        ]);

        return TagParser.parse(
            context,
            (context, tagName) => VOID_ELEMENTS.has(tagName.toLowerCase()) || context.currentCharacter === EndOfFileSyntaxNode.endOfFile,
            (children, leadingTrivia, trailingTrivia) => new TestTagSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
            {
                attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
                attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new TestAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                attributeValueSyntaxNodeFactory: (attributeName, children, leadingTrivia, trailingTrivia) => new TestAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia)
            },
            (value, location, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
        );
    }
}

export class TestCodeParser {
    public static parse(context: ParserContext): SyntaxNode {
        return CodeParser.parse(
            context,
            (transition, openingBrace, children, closingBrace, leadingTrivia, trailingTrivia) => new TestCodeBlockSyntaxNode(transition, openingBrace, children, closingBrace, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestCodeExpressionSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestCodeValueSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new TestBraceSyntaxNode(children, leadingTrivia, trailingTrivia)
        );
    }
}

export class TestBraceParser {
    public static parse(context: ParserContext, expected: "{" | "}"): SyntaxNode {
        return BraceParser.parse(
            context,
            (children, leadingTrivia, trailingTrivia) => new TestBraceSyntaxNode(children, leadingTrivia, trailingTrivia),
            expected);
    }
}

export class TestBracketParser {
    public static parse(context: ParserContext, expected: "<" | ">" | "/>" | "</"): SyntaxNode {
        return BracketParser.parse(
            context,
            (children, leadingTrivia, trailingTrivia) => new TestBracketSyntaxNode(children, leadingTrivia, trailingTrivia),
            expected);
    }
}