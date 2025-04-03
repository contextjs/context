/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { Route } from "../models/route.js";

export class RouteService {
    public static match(value: string, routes: Route[]): Route | null {
        if (StringExtensions.isNullOrWhiteSpace(value))
            return null;

        value = RouteService.decode(value)
            .replace(/^\/+|\/+$/g, "")
            .split('?')[0]
            .toLowerCase();

        let bestMatch: Route | null = null;
        let bestScore = -1;

        for (const route of routes) {
            const template = RouteService.decode(route.template).toLowerCase();
            const score = this.getScore(value, template);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = route;
            }
        }

        return bestMatch;
    }

    private static getScore(value: string, template: string): number {
        const valueParts = value.split("/");
        const templateParts = template.split("/");

        if (valueParts.length !== templateParts.length && !template.includes("{*"))
            return -1;

        let score = 0;
        let wildcardScore = 0;

        for (let i = 0, j = 0; i < templateParts.length && j < valueParts.length; i++, j++) {
            const templateSegment = templateParts[i];
            const valueSegment = valueParts[j];

            if (StringExtensions.isNullOrWhiteSpace(valueSegment) && templateSegment.endsWith("?")) {
                score += 1;
                continue;
            }

            if (StringExtensions.isNullOrWhiteSpace(valueSegment))
                return -1;

            if (templateSegment === valueSegment)
                score += 10;
            else if (templateSegment.startsWith("{") && templateSegment.endsWith("}")) {
                if (templateSegment.includes("*")) {
                    wildcardScore += 5;
                    while (j < valueParts.length - 1)
                        j++;
                }
                else
                    score += 3;
            }
            else
                return -1;
        }

        return score + wildcardScore;
    }

    private static decode(value: string): string {
        try {
            let previousValue = value;
            let decodedValue = decodeURIComponent(value);

            while (decodedValue !== previousValue) {
                previousValue = decodedValue;
                decodedValue = decodeURIComponent(decodedValue);
            }

            return decodedValue;
        }
        catch {
            return value;
        }
    }
}
