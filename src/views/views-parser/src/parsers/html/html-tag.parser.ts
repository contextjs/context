/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-script license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { EndOfFileSyntaxNode, HtmlBracketSyntaxNode, ScriptAttributeValueSyntaxNode, StyleAttributeValueSyntaxNode } from "../../api/index.js";
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
        const EVENTS = new Set([
            // Clipboard events
            "oncopy", "oncut", "onpaste",
            // Keyboard events
            "onkeydown", "onkeypress", "onkeyup",
            // Focus events
            "onfocus", "onblur", "onfocusin", "onfocusout",
            // Form events
            "onchange", "oninput", "oninvalid", "onreset", "onsearch", "onselect", "onsubmit",
            // Mouse events
            "onclick", "ondblclick", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove",
            "onmouseout", "onmouseover", "onmouseup", "oncontextmenu",
            // Drag events
            "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop",
            // Media events
            "onabort", "oncanplay", "oncanplaythrough", "ondurationchange", "onemptied", "onended",
            "onerror", "onloadeddata", "onloadedmetadata", "onloadstart", "onpause", "onplay", "onplaying",
            "onprogress", "onratechange", "onseeked", "onseeking", "onstalled", "onsuspend", "ontimeupdate",
            "onvolumechange", "onwaiting",
            // Image events
            "onload", "onerror",
            // Animation events
            "onanimationstart", "onanimationend", "onanimationiteration",
            // Transition events
            "ontransitionend",
            // Toggle events
            "ontoggle",
            // Wheel events
            "onwheel",
            // Touch events
            "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart",
            // Pointer events
            "ongotpointercapture", "onlostpointercapture", "onpointercancel", "onpointerdown", "onpointerenter",
            "onpointerleave", "onpointermove", "onpointerout", "onpointerover", "onpointerup",
            // UI events
            "onscroll", "onresize",
            // Misc
            "onclose", "onshow", "onsort", "onbeforeunload", "onunload", "onhashchange", "onpopstate", "onstorage"
        ]);

        const VOID_ELEMENTS = new Set([
            "area", "base", "br", "col", "embed", "hr", "img",
            "input", "link", "meta", "source", "track", "wbr"
        ]);

        return TagParser.parse(
            context,
            (context, tagName) => VOID_ELEMENTS.has(tagName.toLowerCase()) || context.currentCharacter === EndOfFileSyntaxNode.endOfFile,
            (children, leadingTrivia, trailingTrivia) => new HtmlTagSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new HtmlTagNameSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new HtmlTagStartSyntaxNode(children, leadingTrivia, trailingTrivia),
            (children, leadingTrivia, trailingTrivia) => new HtmlTagEndSyntaxNode(children, leadingTrivia, trailingTrivia),
            {
                attributeSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new HtmlAttributeSyntaxNode(children, leadingTrivia, trailingTrivia),
                attributeNameSyntaxNodeFactory: (children, leadingTrivia, trailingTrivia) => new HtmlAttributeNameSyntaxNode(children, leadingTrivia, trailingTrivia),
                attributeValueSyntaxNodeFactory: (attributeName, children, leadingTrivia, trailingTrivia) => {
                    if (attributeName === "style")
                        return new StyleAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia);
                    if (EVENTS.has(attributeName))
                        return new ScriptAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia);
                    return new HtmlAttributeValueSyntaxNode(attributeName, children, leadingTrivia, trailingTrivia);
                }
            },
            (value, location, leadingTrivia, trailingTrivia) => new HtmlBracketSyntaxNode(value, location, leadingTrivia, trailingTrivia)
        );
    }
}