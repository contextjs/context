/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CompletionList, TextDocumentPositionParams } from 'vscode-languageserver/node.js';

import { ObjectExtensions } from '@contextjs/system';
import { ServerContext } from '../models/server-context.js';

export class CompletionsService {
    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    private setupEvents() {
        this.context.connectionService.connection.onCompletion((position: TextDocumentPositionParams): CompletionList => {
            const document = this.context.documentsService.documents.get(position.textDocument.uri);
            this.context.documentsService.parseDocument(document);

            const cssRegion = this.context.cssLanguageService.getCssRegion(position);
            if (!ObjectExtensions.isNullOrUndefined(cssRegion))
                return this.context.cssLanguageService.complete(position, cssRegion);

            const codeRegion = this.context.codeLanguageService.getRegion(position);
            if (!ObjectExtensions.isNullOrUndefined(codeRegion))
                return this.context.codeLanguageService.complete(position, codeRegion);

            return this.context.htmlLanguageService.complete(position);
        });
    }
}