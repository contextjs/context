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
import { CompilationContext, ViewsCompiler } from "@contextjs/views-compiler";
import { Parser, ParserResult } from '@contextjs/views-parser';
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

    public async processDocumentAsync(document?: TextDocument, force: boolean = false): Promise<void> {
        if (ObjectExtensions.isNullOrUndefined(document))
            return;

        this.context.projectsService.findProject(document.uri);

        const fileExtension = File.getExtension(document.uri);
        if (ObjectExtensions.isNullOrUndefined(fileExtension))
            return;
        this.context.codeLanguageService.setLanguage(fileExtension);

        if (!force && (document.uri === this.context.documentUri && document.version === this.context.documentVersion))
            return;

        this.context.documentVersion = document.version;
        this.context.documentUri = document.uri;
        this.context.document = document;

        if (this.context.projectsService.hasProject(document.uri))
            await this.compileAsync(document);
        else
            this.parse(document);
    }

    private setupEvents() {
        this.documents.onDidChangeContent((event: TextDocumentChangeEvent<TextDocument>) => {
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.processDocumentAsync(event.document);
                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });

        this.documents.onDidOpen((event) => {
            this.processDocumentAsync(event.document);
        });
    }

    private parse(document?: TextDocument): void {
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
            const result = Parser.parse(document.getText(), language);
            this.processParserResult(result, document);
        }
        catch (error) {
            this.context.document = null;
            this.context.parserResult = null;
            console.error(`Error parsing document: ${error}`);
        }
    }

    private async compileAsync(document: TextDocument): Promise<void> {
        try {
            const project = this.context.projectsService.findProject(document.uri);
            if (ObjectExtensions.isNullOrUndefined(project)) {
                this.context.connectionService.connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
                return;
            }

            const compilationContext = new CompilationContext(
                project['root'],
                [document.uri],
                project,
                async () => document.getText(),
                true
            );

            const compiler = new ViewsCompiler(compilationContext);
            const compilerView = await compiler.compileFileAsync(document.uri);

            this.processParserResult(compilerView.parserResult, document);
        }
        catch (error) {
            this.context.document = null;
            this.context.parserResult = null;
            console.error(`Error compiling document: ${error}`);
        }
    }

    private processParserResult(parserResult: ParserResult, document: TextDocument): void {
        this.context.parserResult = parserResult;
        this.context.processParserResult(parserResult);
        const diagnostics = this.context.diagnosticsService.parse();

        if (ObjectExtensions.isNullOrUndefined(diagnostics))
            this.context.connectionService.connection.sendDiagnostics({ uri: document.uri, diagnostics: [] });
        else
            this.context.connectionService.connection.sendDiagnostics(diagnostics);
    }
}