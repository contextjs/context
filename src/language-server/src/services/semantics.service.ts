/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "../extensions/syntax-node-extension-imports.js";

import { ObjectExtensions } from "@contextjs/system";
import { ServerContext } from "../models/server-context.js";

export class SemanticsService {
    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    private setupEvents() {
        this.context.connectionService.connection.languages.semanticTokens.on((params: any) => {
            return Promise.resolve({
                data: ObjectExtensions.isNullOrUndefined(this.context.semanticTokens)
                    ? []
                    : this.context.semanticTokens
            });
        });
    }
}