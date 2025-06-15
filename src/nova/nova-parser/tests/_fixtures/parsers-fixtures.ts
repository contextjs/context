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
import { CodeParser } from "../../src/parsers/generic/code/code.parser";
import { TagParser } from "../../src/parsers/generic/tags/tag.parser";
import { CDATAParser } from "../../src/parsers/html/cdata.parser";
import { AttributeSyntaxNode } from "../../src/syntax/abstracts/attributes/attribute-syntax-node";
import { AttributeValueSyntaxNode } from "../../src/syntax/abstracts/attributes/attribute-value-syntax-node";
import { CodeSyntaxNode } from "../../src/syntax/abstracts/code/code-syntax-node";
import { CodeValueSyntaxNode } from "../../src/syntax/abstracts/code/code-value-syntax-node";
import { NameSyntaxNode } from "../../src/syntax/abstracts/name.syntax-node";
import { SyntaxNode } from "../../src/syntax/abstracts/syntax-node";
import { TagEndSyntaxNode } from "../../src/syntax/abstracts/tags/tag-end-syntax-node";
import { TagNameSyntaxNode } from "../../src/syntax/abstracts/tags/tag-name-syntax-node";
import { TagStartSyntaxNode } from "../../src/syntax/abstracts/tags/tag-start-syntax-node";
import { TagSyntaxNode } from "../../src/syntax/abstracts/tags/tag-syntax-node";
import { EndOfFileSyntaxNode } from "../../src/syntax/common/end-of-file-syntax-node";

class TestTagSyntaxNode extends TagSyntaxNode { }
class TestTagNameSyntaxNode extends TagNameSyntaxNode { }
class TestTagStartSyntaxNode extends TagStartSyntaxNode { }
class TestTagEndSyntaxNode extends TagEndSyntaxNode { }

class TestAttributeSyntaxNode extends AttributeSyntaxNode { }
class TestAttributeNameSyntaxNode extends NameSyntaxNode { }
class TestAttributeValueSyntaxNode extends AttributeValueSyntaxNode { }

class TestCodeSyntaxNode extends CodeSyntaxNode { }
class TestCodeValueSyntaxNode extends CodeValueSyntaxNode { }

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

export class TestAttributeParser extends AttributeParser {
    public static parse(context: ParserContext): TestAttributeSyntaxNode {
        return AttributeParser.parse(
            context,
            TestAttributeSyntaxNode,
            TestAttributeNameSyntaxNode,
            TestAttributeValueSyntaxNode
        );
    }
}

export class TestTagParser extends TagParser {
    public static parse(context: ParserContext): TestTagSyntaxNode {
        return TagParser.parse(
            context,
            TestTagSyntaxNode,
            TestTagNameSyntaxNode,
            TestTagStartSyntaxNode,
            TestTagEndSyntaxNode,
            {
                attributeSyntaxNode: TestAttributeSyntaxNode,
                attributeNameSyntaxNode: TestAttributeNameSyntaxNode,
                attributeValueSyntaxNode: TestAttributeValueSyntaxNode
            }
        );
    }
}

export class TestCodeParser {
    public static parse(context: ParserContext): SyntaxNode {
        return CodeParser.parse(
            context,
            TestCodeSyntaxNode,
            TestCodeValueSyntaxNode
        );
    }
}