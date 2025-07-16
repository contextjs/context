/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import cssLanguageService from "vscode-css-languageservice";
const { getCSSLanguageService } = cssLanguageService;

import { ObjectExtensions } from "@contextjs/system";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Color, ColorPresentationParams, TextDocumentPositionParams } from 'vscode-languageserver/node.js';
import { ServerContext } from '../../models/server-context.js';
import { ILanguageService } from "./interfaces/i-language.service.js";

export class CSSLanguageService implements ILanguageService {
    public service = getCSSLanguageService();
    private stylesheet = null;
    
    public context: ServerContext;
    public readonly id: string = "css";

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public complete(node: any, document: TextDocument, position: TextDocumentPositionParams) {
        // const docText = this.replaceExcept(document.getText(), [node.node.text]);
        // const clone = TextDocument.create(document.uri, 'css', document.version, docText);
        // this.stylesheet = this.service.parseStylesheet(clone);
        // const ddd = this.service.doComplete(document, position.position, this.stylesheet);
        // return ddd;

        return this.service.doComplete(document, position.position, this.stylesheet || this.service.parseStylesheet(document));
    }

    public onDocumentColor() {
        if (this.context.colors.length === 0)
            return Promise.resolve(null);

        return Promise.resolve(this.context.colors.map(color => color.information));
    }

    public onColorPresentation(params: ColorPresentationParams) {
        if (this.context.colors.length === 0)
            return Promise.resolve([]);

        const colorBox = this.context.colors.find(color =>
            color.information.range.start.line === params.range.start.line &&
            color.information.range.start.character === params.range.start.character &&
            color.information.range.end.line === params.range.end.line &&
            color.information.range.end.character === params.range.end.character
        );

        if (ObjectExtensions.isNullOrUndefined(colorBox))
            return Promise.resolve([]);

        const hexColor = this.colorToHex(params.color);
        const hslColor = this.colorToHsl(params.color);

        const presentations = [
            {
                label: hexColor,
                textEdit: { range: colorBox.information.range, newText: hexColor }
            },
        ];

        if (params.color.alpha === 1) {
            const rgbColor = this.colorToRgb(params.color);
            presentations.push(
                {
                    label: rgbColor,
                    textEdit: { range: colorBox.information.range, newText: rgbColor }
                });
        }
        else {
            const rgbaColor = this.colorToRgba(params.color);
            presentations.push(
                {
                    label: rgbaColor,
                    textEdit: { range: colorBox.information.range, newText: rgbaColor }
                });
        }

        presentations.push(
            {
                label: hslColor,
                textEdit: { range: colorBox.information.range, newText: hslColor }
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

// private replaceExcept(input: string, toExcludeArray: string[]): string {
//     // Escape and join all strings in the exclusion array to create a regex
//     const escapedPatterns = toExcludeArray.map(str =>
//         str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
//     );
//     const regex = new RegExp(escapedPatterns.join('|'), 'gs'); // Join with OR `|` operator

//     // Replace everything except newlines with spaces
//     let result = input.replace(/./gs, (char) => (char === '\n' ? '\n' : ' '));

//     // Reinsert each excluded block back into the result
//     toExcludeArray.forEach((block) => {
//         const index = input.indexOf(block);
//         if (index !== -1) {
//             result = result.slice(0, index) + block + result.slice(index + block.length);
//         }
//     });

//     return result;
// }