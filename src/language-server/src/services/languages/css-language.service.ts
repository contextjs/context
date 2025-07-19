/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import cssLanguageService from "vscode-css-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
    Color,
    ColorPresentationParams,
    CompletionItemKind,
    CompletionList,
    InsertTextFormat,
    Position,
    TextDocumentPositionParams
} from 'vscode-languageserver/node.js';

const { getCSSLanguageService } = cssLanguageService;

import { ObjectExtensions } from "@contextjs/system";
import { CssRegion } from "../../models/css-region.js";
import { ServerContext } from '../../models/server-context.js';
import { ILanguageService } from "./interfaces/i-language.service.js";

export class CSSLanguageService implements ILanguageService {
    public service = getCSSLanguageService();
    public context: ServerContext;

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public getCssRegion(position: Position): CssRegion | null {
        if (ObjectExtensions.isNullOrUndefined(this.context.document))
            return null;

        const docOffset = this.context.document.offsetAt(position);

        for (const region of this.context.cssRegions) {
            if (region.documentStart <= docOffset && docOffset <= region.documentEnd) {
                const cssOffset = region.mapDocumentOffsetToCss(docOffset);
                if (cssOffset !== null)
                    return region;
            }
        }

        return null;
    }

    public complete(position: TextDocumentPositionParams, region: CssRegion): CompletionList {
        const document = this.context.documentsService.documents.get(position.textDocument.uri);

        if (ObjectExtensions.isNullOrUndefined(region) || ObjectExtensions.isNullOrUndefined(document))
            return { isIncomplete: false, items: [] };

        this.context.documentsService.parseDocument(document);

        const documentOffset = document.offsetAt(position.position);
        const cssOffset = region.mapDocumentOffsetToCss(documentOffset);
        if (cssOffset === null)
            return { isIncomplete: false, items: [] };

        const cssDocument = TextDocument.create(document.uri + ".css-virtual", "css", 1, this.context.cssDocument);
        const stylesheet = this.service.parseStylesheet(cssDocument);
        const cssWordPrefix = this.getCssWordPrefix(this.context.cssDocument, cssOffset);
        const documentStartIndex = region.mapCssOffsetToDocument(cssWordPrefix.start);
        const documentEndIndex = region.mapCssOffsetToDocument(cssOffset);
        if (documentStartIndex === null || documentEndIndex === null)
            return this.service.doComplete(cssDocument, cssDocument.positionAt(cssOffset), stylesheet);

        const documentRange = { start: document.positionAt(documentStartIndex), end: document.positionAt(documentEndIndex) };
        const result = this.service.doComplete(cssDocument, cssDocument.positionAt(cssOffset), stylesheet);

        const patchedItems = result.items.map(item => {
            if (item.kind === CompletionItemKind.Property)
                return {
                    ...item,
                    textEdit: {
                        range: documentRange,
                        newText: `${item.label.replace(/[:;]$/, '')}: $1;`
                    },
                    insertTextFormat: InsertTextFormat.Snippet
                };

            return {
                ...item,
                textEdit: {
                    range: documentRange,
                    newText: item.label
                }
            };
        });

        return { ...result, items: patchedItems };
    }

    private getCssWordPrefix(buffer: string, offset: number): { start: number, value: string } {
        let i = offset - 1;

        while (i >= 0 && /[a-zA-Z0-9\-]/.test(buffer[i]))
            i--;

        const start = i + 1;
        const value = buffer.slice(start, offset);

        return { start, value };
    }


    public onDocumentColor() {
        if (this.context.colors.length === 0)
            return null;

        return Promise.resolve(this.context.colors.map(color => color.information));
    }

    public onColorPresentation(params: ColorPresentationParams) {
        if (this.context.colors.length === 0)
            return [];

        const colorPresentation = this.context.colors.find(color =>
            color.information.range.start.line === params.range.start.line &&
            color.information.range.start.character === params.range.start.character &&
            color.information.range.end.line === params.range.end.line &&
            color.information.range.end.character === params.range.end.character
        );

        if (ObjectExtensions.isNullOrUndefined(colorPresentation))
            return [];

        const hexColor = this.colorToHex(params.color);
        const hslColor = this.colorToHsl(params.color);

        const presentations = [
            {
                label: hexColor,
                textEdit: { range: colorPresentation.information.range, newText: hexColor }
            },
        ];

        if (params.color.alpha === 1) {
            const rgbColor = this.colorToRgb(params.color);
            presentations.push(
                {
                    label: rgbColor,
                    textEdit: { range: colorPresentation.information.range, newText: rgbColor }
                });
        }
        else {
            const rgbaColor = this.colorToRgba(params.color);
            presentations.push(
                {
                    label: rgbaColor,
                    textEdit: { range: colorPresentation.information.range, newText: rgbaColor }
                });
        }

        presentations.push(
            {
                label: hslColor,
                textEdit: { range: colorPresentation.information.range, newText: hslColor }
            }
        );

        return Promise.resolve(presentations);
    }

    private colorToRgb(color: Color) {
        const r = Math.round(color.red * 255);
        const g = Math.round(color.green * 255);
        const b = Math.round(color.blue * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }

    private colorToRgba(color: Color): string {
        const r = Math.round(color.red * 255);
        const g = Math.round(color.green * 255);
        const b = Math.round(color.blue * 255);

        return `rgba(${r}, ${g}, ${b}, ${parseFloat(color.alpha.toFixed(2))})`;
    }

    private colorToHex(color: Color): string {
        const r = Math.round(color.red * 255).toString(16).padStart(2, "0");
        const g = Math.round(color.green * 255).toString(16).padStart(2, "0");
        const b = Math.round(color.blue * 255).toString(16).padStart(2, "0");

        return (`#${r}${g}${b}`);
    }

    private colorToHsl(color: Color): string {
        const
            red = color.red,
            green = color.green,
            blue = color.blue,
            maxChannel = Math.max(red, green, blue),
            minChannel = Math.min(red, green, blue);

        let
            hue = 0,
            saturation = 0,
            lightness = (maxChannel + minChannel) / 2;

        if (maxChannel !== minChannel) {
            const delta = maxChannel - minChannel;
            saturation = lightness > 0.5
                ? delta / (2 - maxChannel - minChannel)
                : delta / (maxChannel + minChannel);

            switch (maxChannel) {
                case red:
                    hue = ((green - blue) / delta) + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = ((blue - red) / delta) + 2;
                    break;
                case blue:
                    hue = ((red - green) / delta) + 4;
                    break;
            }
            hue = hue / 6;
        }

        const h = Math.round(hue * 360);
        const s = Math.round(saturation * 100);
        const l = Math.round(lightness * 100);

        return color.alpha === 1
            ? `hsl(${h}, ${s}%, ${l}%)`
            : `hsla(${h}, ${s}%, ${l}%, ${parseFloat(color.alpha.toFixed(2))})`;
    }
}