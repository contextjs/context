/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "@contextjs/views";

export class CssRegion {
    public readonly documentStart: number;
    public readonly documentEnd: number;
    public readonly cssStart: number;
    public readonly cssEnd: number;
    public readonly envelopePrefix: number;
    public readonly envelopeSuffix: number;
    public readonly location: Location;

    constructor(
        documentStart: number,
        documentEnd: number,
        cssStart: number,
        cssEnd: number,
        location: Location,
        envelopePrefix: number = 0,
        envelopeSuffix: number = 0) {
        this.documentStart = documentStart;
        this.documentEnd = documentEnd;
        this.cssStart = cssStart;
        this.cssEnd = cssEnd;
        this.location = location;
        this.envelopePrefix = envelopePrefix;
        this.envelopeSuffix = envelopeSuffix;
    }

    public mapDocumentOffsetToCss(documentOffset: number): number | null {
        if (documentOffset < this.documentStart || documentOffset > this.documentEnd)
            return null;

        return this.cssStart + this.envelopePrefix + (documentOffset - this.documentStart);
    }

    public mapCssOffsetToDocument(cssOffset: number): number | null {
        if (cssOffset < this.cssStart + this.envelopePrefix || cssOffset > this.cssEnd - this.envelopeSuffix)
            return null;

        return this.documentStart + (cssOffset - this.cssStart - this.envelopePrefix);
    }
}