/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export type ConsoleMessage = {
    format: ForegroundColors | BackgroundColors | Modifiers | Array<ForegroundColors | BackgroundColors | Modifiers>,
    text: string
};

export type Modifiers =
    'blink' |
    'bold' |
    'dim' |
    'doubleunderline' |
    'framed' |
    'hidden' |
    'inverse' |
    'italic' |
    'overlined' |
    'reset' |
    'strikethrough' |
    'underline';

export type ForegroundColors =
    'black' |
    'blue' |
    'cyan' |
    'gray' |
    'green' |
    'grey' |
    'magenta' |
    'red' |
    'white' |
    'yellow';

export type BackgroundColors =
    'bgBlack' |
    'bgBlue' |
    'bgCyan' |
    'bgGray' |
    'bgGreen' |
    'bgMagenta' |
    'bgRed' |
    'bgWhite' |
    'bgYellow';