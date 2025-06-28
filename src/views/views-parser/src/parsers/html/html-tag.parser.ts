/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HtmlBracketSyntaxNode } from "../../api/index.js";
import { ParserContext } from "../../context/parser-context.js";
import { SyntaxNode } from "../../syntax/abstracts/syntax-node.js";
import { HtmlAttributeNameSyntaxNode } from "../../syntax/html/attributes/html-attribute-name-syntax-node.js";
import { HtmlAttributeSyntaxNode } from "../../syntax/html/attributes/html-attribute-syntax-node.js";
import { HtmlAttributeValueSyntaxNode } from "../../syntax/html/attributes/html-attribute-value-syntax-node.js";
import { HtmlTagEndSyntaxNode } from "../../syntax/html/tags/html-tag-end-syntax-node.js";
import { HtmlTagNameSyntaxNode } from "../../syntax/html/tags/html-tag-name-syntax-node.js";
import { HtmlTagStartSyntaxNode } from "../../syntax/html/tags/html-tag-start-syntax-node.js";
import { HtmlTagSyntaxNode } from "../../syntax/html/tags/html-tag-syntax-node.js";
import { TagParser } from "../generic/tags/tag.parser.js";

export class HtmlTagParser {
    public static parse(context: ParserContext): SyntaxNode {
        return TagParser.parse(
            context,
            HtmlTagSyntaxNode,
            HtmlTagNameSyntaxNode,
            HtmlTagStartSyntaxNode,
            HtmlTagEndSyntaxNode,
            {
                attributeSyntaxNode: HtmlAttributeSyntaxNode,
                attributeNameSyntaxNode: HtmlAttributeNameSyntaxNode,
                attributeValueSyntaxNode: HtmlAttributeValueSyntaxNode
            },
            HtmlBracketSyntaxNode);
    }
}