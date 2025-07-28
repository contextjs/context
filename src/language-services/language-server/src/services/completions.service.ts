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

    private setupEvents(): void {
        this.context.connectionService.connection.onCompletion(async (position: TextDocumentPositionParams): Promise<CompletionList> => {
            const document = this.context.documentsService.documents.get(position.textDocument.uri);
            await this.context.documentsService.processDocumentAsync(document, true);

            const cssRegion = this.context.cssLanguageService.getCssRegion(position);
            if (!ObjectExtensions.isNullOrUndefined(cssRegion))
                return await this.context.cssLanguageService.completeAsync(position, cssRegion);

            const codeRegion = this.context.codeLanguageService.getRegion(position);
            if (!ObjectExtensions.isNullOrUndefined(codeRegion))
                return await this.context.codeLanguageService.completeAsync(position, codeRegion);

            return await this.context.htmlLanguageService.completeAsync(position);
        });
    }
}