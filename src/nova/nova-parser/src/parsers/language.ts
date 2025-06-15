/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export enum Language {
    TSHTML = 'tshtml'
}

export class LanguageExtensions {
    public static fromString(value: string): Language | null {
        switch (value?.toLowerCase()?.trim()) {
            case "tshtml":
                return Language.TSHTML;
            default:
                return null;
        }
    }
}