/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import os from "node:os";

export class StringExtensions {
    private static readonly lineBreaks = ['\r', '\n', '\u0085', '\u2028', '\u2029'];

    public static readonly empty: string = "";
    public static readonly newLine: string = os.EOL;

    public static isNullOrEmpty(value: string | null | undefined): value is null | undefined | "" {
        return value === null || value === undefined || value === StringExtensions.empty;
    }

    public static isNullOrUndefined(value: string | null | undefined): value is null | undefined {
        return value === null || value === undefined;
    }

    public static isNullOrWhiteSpace(value: string | null | undefined): value is null | undefined | "" {
        return this.isNullOrEmpty(value) || value?.trim() === StringExtensions.empty;
    }

    public static removeWhiteSpaces(value: string): string {
        return value.replace(/\s/g, "");
    }

    public static isLineBreak(value: string): boolean {
        return this.lineBreaks.includes(value);
    }

    public static isDigit(character: string): boolean {
        return /^\d$/.test(character);
    }

    public static isLetter(character: string): boolean {
        return /^\p{L}$/u.test(character);
    }

    public static isLetterOrDigit(value: string): boolean {
        return this.isLetter(value) || this.isDigit(value);
    }

    public static isWhiteSpace(value: string): boolean {
        return /^\s$/.test(value);
    }

    public static containsOnlyLineBreaksAndSpaces(value: string): boolean {
        return /^[\s\n\r\u0085\u2028\u2029]*$/.test(value);
    }

    public static format(template: string, ...args: any[]): string {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }
}