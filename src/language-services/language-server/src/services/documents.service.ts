/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver/node.js';

import { File } from '@contextjs/io';
import { ObjectExtensions } from '@contextjs/system';
import { ServerContext } from '../models/server-context.js';

export class DocumentsService {
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

    public parseDocument(document?: TextDocument) {
        if (ObjectExtensions.isNullOrUndefined(document))
            return;

        const fileExtension = File.getExtension(document.uri);
        if (ObjectExtensions.isNullOrUndefined(fileExtension))
            return;
        this.context.codeLanguageService.setLanguage(fileExtension);

        if (document.uri === this.context.documentUri && document.version === this.context.documentVersion)
            return;

        this.context.documentVersion = document.version;
        this.context.documentUri = document.uri;

        this.context.parsersService.parse(document);
        const diagnostics = this.context.diagnosticsService.parse();

        if (ObjectExtensions.isNullOrUndefined(diagnostics))
            this.context.connectionService.connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
        else
            this.context.connectionService.connection.sendDiagnostics(diagnostics);
    }

    private setupEvents() {
        this.documents.onDidChangeContent((event: TextDocumentChangeEvent<TextDocument>) => {
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.parseDocument(event.document);
                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });

        this.documents.onDidOpen((event) => {
            this.parseDocument(event.document);
        });
    }
}