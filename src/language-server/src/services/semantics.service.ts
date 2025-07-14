/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "@contextjs/system";
import "../semantics/extensions/syntax-node-extension-imports.js";
import { ServerContext } from "../server-context.js";

export class SemanticsService {
    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    public parseTokens(): void {
        if (ObjectExtensions.isNullOrUndefined(this.context.parserResult))
            return;

        this.context.semanticTokensContext.clear();

        for (const node of this.context.parserResult.nodes)
            node.parseSemanticTokens(this.context.semanticTokensContext);

        this.context.semanticTokensContext.getData();
    }

    private setupEvents() {
        this.context.connectionService.connection.languages.semanticTokens.on((params: any) => {
            console.error(JSON.stringify(this.context.parserResult));
            return Promise.resolve({
                data: ObjectExtensions.isNullOrUndefined(this.context.parserResult)
                    ? []
                    : this.context.semanticTokensContext.data
            });
        });
    }
}