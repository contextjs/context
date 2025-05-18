/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { IParsedSegment } from "../interfaces/i-parsed-segment.js";
import { RouteInfo } from "../models/route-info.js";
import { SegmentKind } from "../models/segment-kind.js";

export class RouteService {
    public static match(value: string, routes: RouteInfo[]): RouteInfo | null {
        if (StringExtensions.isNullOrWhiteSpace(value))
            return null;

        value = this.normalizePath(value);
        const maxScore = value.split("/").length * 10;
        let bestMatch: RouteInfo | null = null;
        let bestScore = -1;

        for (const route of routes) {
            const score = this.getScore(value, route.decodedTemplate);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = route;

                if (score === maxScore)
                    break;
            }
        }

        return bestMatch;
    }

    private static getScore(value: string, template: string): number {
        const valueParts = value.split("/");
        const templateParts = template.split("/");

        const hasCatchAll = this.hasCatchAll(templateParts);
        if (!hasCatchAll && valueParts.length > templateParts.length)
            return -1;

        let score = 0;
        let wildcardScore = 0;
        let i = 0;
        let j = 0;

        while (i < templateParts.length) {
            const segment = this.parseSegment(templateParts[i]);
            const valueSegment = j < valueParts.length ? valueParts[j] : "";

            if (segment.kind === SegmentKind.CatchAll) {
                wildcardScore += 5;
                break;
            }

            if (StringExtensions.isNullOrWhiteSpace(valueSegment)) {
                if (segment.kind === SegmentKind.Optional) {
                    score += 1;
                    i++;
                    continue;
                }

                return -1;
            }

            if (segment.kind === SegmentKind.Literal && segment.raw === valueSegment)
                score += 10;
            else if (segment.kind === SegmentKind.Optional || segment.kind === SegmentKind.Parameter)
                score += 3;
            else
                return -1;

            i++;
            j++;
        }

        if (j < valueParts.length && !hasCatchAll)
            return -1;

        return score + wildcardScore;
    }

    public static decode(value: string): string {
        try {
            if (!value.includes("%"))
                return value;

            let previous = value;
            let current = decodeURIComponent(value);
            let iterations = 0;

            while (current !== previous && iterations++ < 10) {
                previous = current;
                current = decodeURIComponent(current);
            }

            return current.toLowerCase();
        }
        catch {
            return value.toLowerCase();
        }
    }

    private static normalizePath(value: string): string {
        return this.decode(value)
            .replace(/^\/+|\/+$/g, "")
            .split('?')[0]
            .toLowerCase();
    }

    private static parseSegment(segment: string): IParsedSegment {
        if (!segment.startsWith("{") || !segment.endsWith("}"))
            return { kind: SegmentKind.Literal, raw: segment };

        const inner = segment.slice(1, -1);

        if (inner.startsWith("*"))
            return { kind: SegmentKind.CatchAll, raw: segment, name: inner.slice(1) };

        if (inner.endsWith("?"))
            return { kind: SegmentKind.Optional, raw: segment, name: inner.slice(0, -1) };

        return { kind: SegmentKind.Parameter, raw: segment, name: inner };
    }

    private static hasCatchAll(templateParts: string[]): boolean {
        return templateParts.some(t => this.parseSegment(t).kind === SegmentKind.CatchAll);
    }
}