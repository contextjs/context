/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from '@contextjs/system';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocuments } from 'vscode-languageserver/node.js';
import { ServerContext } from '../server-context.js';

export class DocumentService {
    public readonly documents: TextDocuments<TextDocument>;
    private readonly debounceTimeouts = new Map<string, NodeJS.Timeout>();
    private readonly debounceDelay = 200;

    public constructor(private readonly context: ServerContext) {
        this.documents = new TextDocuments(TextDocument);
        this.setupEvents();
    }

    public listen() {
        this.documents.listen(this.context.connectionService.connection);
    }

    private setupEvents() {
        this.documents.onDidChangeContent((event) => {
            this.context.parserResult = null;
            this.context.semanticTokensContext.clear();
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.context.parserService.parse(event.document);
                this.context.semanticsService.parseTokens();

                const diagnostics = this.context.diagnosticsService.analyse();
                if (ObjectExtensions.isNullOrUndefined(diagnostics))
                    this.context.connectionService.connection.sendDiagnostics({ uri, diagnostics: [] });
                else
                    this.context.connectionService.connection.sendDiagnostics(diagnostics);

                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });
    }
}