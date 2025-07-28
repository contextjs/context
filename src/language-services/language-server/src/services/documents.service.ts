/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import * as url from 'node:url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver/node.js';

import { File } from '@contextjs/io';
import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import { LanguageExtensions } from '@contextjs/views';
import { Parser } from '@contextjs/views-parser';
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

    public processDocument(document?: TextDocument) {
        if (ObjectExtensions.isNullOrUndefined(document))
            return;

        this.context.projectsService.findProject(document.uri);

        const fileExtension = File.getExtension(document.uri);
        if (ObjectExtensions.isNullOrUndefined(fileExtension))
            return;
        this.context.codeLanguageService.setLanguage(fileExtension);

        if (document.uri === this.context.documentUri && document.version === this.context.documentVersion)
            return;

        this.context.documentVersion = document.version;
        this.context.documentUri = document.uri;

        this.parse(document);
    }

    private setupEvents() {
        this.documents.onDidChangeContent((event: TextDocumentChangeEvent<TextDocument>) => {
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.processDocument(event.document);
                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });

        this.documents.onDidOpen((event) => {
            this.processDocument(event.document);
        });
    }

    public parse(document?: TextDocument): void {
        if (ObjectExtensions.isNullOrUndefined(document))
            return;

        const localPath = url.fileURLToPath(document.uri);
        if (StringExtensions.isNullOrWhitespace(localPath))
            return;

        const fileExtension = localPath.split('.').pop()?.toLowerCase();
        if (StringExtensions.isNullOrWhitespace(fileExtension))
            return;

        const language = LanguageExtensions.fromString(fileExtension);
        if (ObjectExtensions.isNullOrUndefined(language))
            return;

        try {
            this.context.document = document;
            const result = Parser.parse(document.getText(), language);

            this.context.processParserResult(result);
            this.context.parserResult = result;

            const diagnostics = this.context.diagnosticsService.parse();

            if (ObjectExtensions.isNullOrUndefined(diagnostics))
                this.context.connectionService.connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
            else
                this.context.connectionService.connection.sendDiagnostics(diagnostics);
        }
        catch (error) {
            this.context.document = null;
            this.context.parserResult = null;
            console.error(`Error parsing document: ${error}`);
        }
    }
}