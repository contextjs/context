/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParserResult } from '@contextjs/views-parser';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ServerOptions } from './server-options.js';
import { ConnectionService } from './services/connection.service.js';
import { DiagnosticsService } from './services/diagnostic.service.js';
import { DocumentService } from './services/document.service.js';
import { ParserService } from './services/parser.service.js';

export class ServerContext {
    public document: TextDocument | null = null;
    public options: ServerOptions;
    public parserResult: ParserResult | null = null;

    public connectionService!: ConnectionService;
    public documentService!: DocumentService;
    public parserService!: ParserService;
    public diagnosticsService!: DiagnosticsService;

    public constructor(options: ServerOptions) {
        this.options = options;
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
    }
}