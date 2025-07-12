/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserResult } from '@contextjs/views-parser';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SemanticTokenContext } from './semantics/semantic-token-context.js';
import { ConnectionService } from './services/connection.service.js';
import { DiagnosticsService } from './services/diagnostic.service.js';
import { DocumentService } from './services/document.service.js';
import { ParserService } from './services/parser.service.js';
import { SemanticsService } from './services/semantics.service.js';

export class ServerContext {
    public document: TextDocument | null = null;
    public parserResult: ParserResult | null = null;
    public readonly semanticTokensContext: SemanticTokenContext = new SemanticTokenContext();

    public connectionService!: ConnectionService;
    public documentService!: DocumentService;
    public parserService!: ParserService;
    public diagnosticsService!: DiagnosticsService;
    public semanticsService!: SemanticsService;

    public constructor() {
        this.createServices();
    }

    public listen(): void {
        this.documentService.listen();
        this.connectionService.listen();
    }

    private createServices() {
        this.connectionService = new ConnectionService(this);
        this.diagnosticsService = new DiagnosticsService(this);
        this.documentService = new DocumentService(this);
        this.parserService = new ParserService(this);
        this.semanticsService = new SemanticsService(this);
    }
}