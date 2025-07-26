/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Language } from "@contextjs/views";
import { ParserType } from "./parser.js";
import { TSHTMLParser } from "./tshtml/tshtml.parser.js";

export class ParserResolver {
    public static resolve(language: Language): ParserType | null {
        switch (language) {
            case Language.TSHTML:
                return TSHTMLParser;
            default:
                return null;
        }
    }
}