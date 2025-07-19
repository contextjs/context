/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "../extensions/syntax-node-extension-imports.js";

import { SemanticTokensParams } from "vscode-languageserver";

import { ObjectExtensions } from "@contextjs/system";
import { ServerContext } from "../models/server-context.js";

export class SemanticsService {
    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    private setupEvents() {
        this.context.connectionService.connection.languages.semanticTokens.on((params: SemanticTokensParams) => {
            const document = this.context.documentsService.documents.get(params.textDocument.uri);
            this.context.parsersService.parse(document);

            return Promise.resolve({
                data: ObjectExtensions.isNullOrUndefined(this.context.semanticTokens)
                    ? []
                    : this.context.semanticTokens
            });
        });
    }
}