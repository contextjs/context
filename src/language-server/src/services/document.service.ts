/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from '@contextjs/system';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver/node.js';
import { ServerContext } from '../models/server-context.js';

export class DocumentService {
    public readonly documents: TextDocuments<TextDocument>;
    private readonly debounceTimeouts = new Map<string, NodeJS.Timeout>();
    private readonly debounceDelay = 100;

    public constructor(private readonly context: ServerContext) {
        this.documents = new TextDocuments(TextDocument);
        this.setupEvents();
    }

    public listen() {
        this.documents.listen(this.context.connectionService.connection);
    }

    private setupEvents() {
        this.documents.onDidChangeContent((event) => {
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.parseDocument(event);
                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });

        this.documents.onDidOpen((event) => {
            this.parseDocument(event);
        });
    }

    private parseDocument(event: TextDocumentChangeEvent<TextDocument>) {
        this.context.parserService.parse(event.document);

        const diagnostics = this.context.diagnosticsService.analyse();
        if (ObjectExtensions.isNullOrUndefined(diagnostics))
            this.context.connectionService.connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
        else
            this.context.connectionService.connection.sendDiagnostics(diagnostics);
    }
}