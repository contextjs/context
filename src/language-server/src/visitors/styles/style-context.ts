/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import cssLanguageService from "vscode-css-languageservice";
const { TextDocument } = cssLanguageService;

import { Stack } from "@contextjs/collections";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { Location } from "@contextjs/views";
import { StyleContentSyntaxNode } from "@contextjs/views-parser";
import { Range } from "vscode-languageserver/node.js";
import { ColorBox } from "../../models/color-box.js";
import { ServerContext } from "../../models/server-context.js";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";

export class StyleContext {
    private colors: ColorBox[] = [];
    private serverContext: ServerContext;

    public constructor(serverContext: ServerContext) {
        this.serverContext = serverContext;
    }

    public state: Stack<SyntaxNodeType> = new Stack<SyntaxNodeType>();

    public reset(): void {
        this.colors.length = 0;
        this.state.clear();
    }

    public setColors(node: StyleContentSyntaxNode, addEnvelope: boolean = false): void {
        if (ObjectExtensions.isNullOrUndefined(node) || StringExtensions.isNullOrUndefined(node.value))
            return;

        const value = addEnvelope ? `t{${node.value}}` : node.value;
        const cssService = this.serverContext.cssLanguageService.service;
        const cssDoc = TextDocument.create("untitled:style", "css", 1, value);
        const stylesheet = cssService.parseStylesheet(cssDoc);
        const colors = cssService.findDocumentColors(cssDoc, stylesheet);

        if (ObjectExtensions.isNullOrUndefined(colors) || colors.length === 0)
            return;

        for (const colorInfo of colors) {
            const label = node.value.substring(colorInfo.range.start.character, colorInfo.range.end.character);
            colorInfo.range = this.getColorRange(colorInfo.range, node.location, addEnvelope ? -2 : 0);

            this.colors.push(new ColorBox(label, colorInfo));
        }
    }

    public getColors(): ColorBox[] {
        return this.colors;
    }

    private getColorRange(range: Range, location: Location, characterOffset: number = 0): Range {
        const docStartLine = location.startLineIndex;
        const cssStartLineInfo = location.lines[range.start.line];
        const docStartChar = cssStartLineInfo.startCharacterIndex + range.start.character;

        const cssEndLineInfo = location.lines[range.end.line];
        const docEndChar = cssEndLineInfo.startCharacterIndex + range.end.character;

        return {
            start: {
                line: docStartLine + range.start.line,
                character: docStartChar + characterOffset
            },
            end: {
                line: docStartLine + range.end.line,
                character: docEndChar + characterOffset
            }
        };
    }
}