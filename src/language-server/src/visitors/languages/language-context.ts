/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { ServerContext } from "../../models/server-context.js";
import { SyntaxNodeType } from "../../models/syntax-node-type.js";

export class LanguageContext {
    private serverContext: ServerContext;
    public state: Stack<SyntaxNodeType> = new Stack<SyntaxNodeType>();

    public reset(): void {
        this.state.clear();
    }

    public constructor(serverContext: ServerContext) {
        this.serverContext = serverContext;
    }

    public get tshtmlLanguageService() {
        return this.serverContext.tshtmlLanguageService;
    }

    public get htmlLanguageService() {
        return this.serverContext.htmlLanguageService;
    }

    public get cssLanguageService() {
        return this.serverContext.cssLanguageService;
    }
}