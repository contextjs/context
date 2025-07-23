/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import cssLanguageService from "vscode-css-languageservice";
import { Range } from "vscode-languageserver/node.js";
const { TextDocument } = cssLanguageService;

import { Stack } from "@contextjs/collections";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { Location } from "@contextjs/views";
import { LiteralSyntaxNode, StyleContentSyntaxNode, SyntaxNode, ValueSyntaxNode } from "@contextjs/views-parser";
import { ColorPresentation } from "../../models/color-presentation.js";
import { CssRegion } from "../../models/css-region.js";
import { ServerContext } from "../../models/server-context.js";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";

export class StyleContext {
    private colors: ColorPresentation[] = [];
    private serverContext: ServerContext;
    private builder: StringBuilder = new StringBuilder();
    private regions: CssRegion[] = [];

    public constructor(serverContext: ServerContext) {
        this.serverContext = serverContext;
    }

    public state: Stack<SyntaxNodeType> = new Stack<SyntaxNodeType>();

    public reset(): void {
        this.state.clear();
        this.builder.clear();
        this.regions.length = 0;
        this.colors.length = 0;
    }

    public parseStyles(node: SyntaxNode, addEnvelope: boolean = false): void {
        const cssStart = this.builder.length;
        if (node instanceof StyleContentSyntaxNode && !StringExtensions.isNullOrUndefined(node.value)) {
            this.builder.append(node.value || '');
            this.regions.push(
                new CssRegion(
                    node.location.absoluteStartCharacterIndex,
                    node.location.absoluteEndCharacterIndex,
                    cssStart,
                    cssStart + (node.value?.length || 0),
                    node.location
                )
            );
        }
        else if (node instanceof LiteralSyntaxNode) {
            if (addEnvelope) {
                const prefix = "t{";
                const suffix = "}";
                this.builder.append(prefix);
                this.builder.append(node.value || '');
                this.builder.append(suffix);
                this.regions.push(
                    new CssRegion(
                        node.location.absoluteStartCharacterIndex,
                        node.location.absoluteEndCharacterIndex,
                        cssStart,
                        cssStart + prefix.length + (node.value?.length || 0) + suffix.length,
                        node.location,
                        prefix.length,
                        suffix.length
                    )
                );
            }
            else
                this.builder.append(node.value?.replace(/[^\s]/g, ' ') || '');
        }
        else if (node instanceof ValueSyntaxNode && !StringExtensions.isNullOrUndefined(node.value))
            this.builder.append(node.value.replace(/[^\s]/g, ' '));
    }

    public setColors(node: StyleContentSyntaxNode, addEnvelope: boolean = false): void {
        if (ObjectExtensions.isNullOrUndefined(node) || StringExtensions.isNullOrUndefined(node.value))
            return;

        const value = addEnvelope ? `t{${node.value}}` : node.value;
        const cssService = this.serverContext.cssLanguageService.service;
        const cssDocument = TextDocument.create("untitled:style", "css", 1, value);
        const stylesheet = cssService.parseStylesheet(cssDocument);
        const colors = cssService.findDocumentColors(cssDocument, stylesheet);

        for (const colorInfo of colors) {
            const label = node.value.substring(colorInfo.range.start.character, colorInfo.range.end.character);
            colorInfo.range = this.getColorRange(colorInfo.range, node.location, addEnvelope ? -2 : 0);

            this.colors.push(new ColorPresentation(label, colorInfo));
        }
    }

    public getColors(): ColorPresentation[] {
        return this.colors;
    }

    public getDocument(): string {
        return this.builder.toString();
    }

    public getRegions(): CssRegion[] {
        return this.regions;
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