/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from '@contextjs/system';
import { ParserResult } from '@contextjs/views-parser';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ConnectionService } from '../services/connection.service.js';
import { DiagnosticsService } from '../services/diagnostic.service.js';
import { DocumentService } from '../services/document.service.js';
import { CSSLanguageService } from '../services/languages/css-language.service.js';
import { HtmlLanguageService } from '../services/languages/html-language.service.js';
import { TSHTMLLanguageService } from '../services/languages/tshtml-language.service.js';
import { ParserService } from '../services/parser.service.js';
import { SemanticsService } from '../services/semantics.service.js';
import { LanguageContext } from '../visitors/languages/language-context.js';
import { LanguageVisitor } from '../visitors/languages/language-visitor.js';
import { SemanticTokenContext } from '../visitors/semantics/semantic-token-context.js';
import { SemanticTokenVisitor } from '../visitors/semantics/semantic-token-visitor.js';
import { StyleContext } from '../visitors/styles/style-context.js';
import { StyleVisitor } from '../visitors/styles/style-visitor.js';
import { ColorBox } from './color-box.js';
import { VisitorContext } from './visitor-context.js';

export class ServerContext {
    public document: TextDocument | null = null;
    public parserResult: ParserResult | null = null;
    public semanticTokens: number[] = [];
    public colors: ColorBox[] = [];

    public semanticTokensContext = new SemanticTokenContext();
    public styleContext = new StyleContext(this);
    public languageContext = new LanguageContext(this);

    public connectionService!: ConnectionService;
    public documentService!: DocumentService;
    public parserService!: ParserService;
    public diagnosticsService!: DiagnosticsService;
    public semanticsService!: SemanticsService;
    public htmlLanguageService!: HtmlLanguageService;
    public cssLanguageService!: CSSLanguageService;
    public tshtmlLanguageService!: TSHTMLLanguageService;

    public constructor() {
        this.createServices();
    }

    public listen(): void {
        this.documentService.listen();
        this.connectionService.listen();
    }

    public visitParserResult() {
        if (ObjectExtensions.isNullOrUndefined(this.parserResult))
            return;

        const visitors = [
            SemanticTokenVisitor.create(this),
            LanguageVisitor.create(this),
            StyleVisitor.create(this)
        ];

        const context = new VisitorContext(visitors);

        for (const node of this.parserResult.nodes)
            node.visit(context);

        this.semanticTokens = this.semanticTokensContext.getData();
        this.colors = this.styleContext.getColors();
    }

    private createServices() {
        this.connectionService = new ConnectionService(this);
        this.diagnosticsService = new DiagnosticsService(this);
        this.documentService = new DocumentService(this);
        this.parserService = new ParserService(this);
        this.semanticsService = new SemanticsService(this);
        this.htmlLanguageService = new HtmlLanguageService(this);
        this.cssLanguageService = new CSSLanguageService(this);
        this.tshtmlLanguageService = new TSHTMLLanguageService(this);
    }
}