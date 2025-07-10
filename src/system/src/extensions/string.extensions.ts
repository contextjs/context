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

    public static isNullOrWhitespace(value: string | null | undefined): value is null | undefined | "" {
        return this.isNullOrEmpty(value) || value?.trim() === StringExtensions.empty;
    }

    public static removeWhitespace(value: string): string {
        return value.replace(/\s/g, "");
    }

    public static removeLineBreaks(value: string): string {
        return value.replace(/[\r\n\u0085\u2028\u2029]/g, "");
    }

    public static isLineBreak(character: string): boolean {
        return this.lineBreaks.includes(character);
    }

    public static isDigit(character: string): boolean {
        return /^\d$/.test(character);
    }

    public static isLetter(character: string): boolean {
        return /^\p{L}$/u.test(character);
    }

    public static isLetterOrDigit(character: string): boolean {
        return this.isLetter(character) || this.isDigit(character);
    }

    public static isWhitespace(character: string): boolean {
        return /^\s$/.test(character);
    }

    public static containsOnlyWhitespace(value: string): boolean {
        return value !== "" && /^\s+$/.test(value);
    }

    public static format(template: string, ...args: any[]): string {
        return template.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }

    public static escape(value: string): string {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/`/g, '\\`')
            .replace(/(?<!\\)\$\{/g, '\\${');
    }
}