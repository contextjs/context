/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserException } from "./parser.exception.js";

export class NoParserFoundException extends ParserException {
    public constructor(language: string) {
        super(`No parser found for language: ${language}`);
        this.name = NoParserFoundException.name;
    }
}