/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export type AutocompleteMode = "Completion" | "Edit";
export type CursorPosition = "Between" | "End";

export interface Settings {
    autocomplete: {
        mode: AutocompleteMode;
        cursorPosition: CursorPosition;
    };
}