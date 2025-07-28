/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { TextDocument } from 'vscode-languageserver-textdocument';

import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import { CodeValueSyntaxNode, ParserResult } from '@contextjs/views-parser';
import { CompletionsService } from '../services/completions.service.js';
import { ConnectionService } from '../services/connection.service.js';
import { DiagnosticsService } from '../services/diagnostics.service.js';
import { DocumentsService } from '../services/documents.service.js';
import { CodeLanguageService } from '../services/languages/code-language.service.js';
import { CSSLanguageService } from '../services/languages/css-language.service.js';
import { HtmlLanguageService } from '../services/languages/html-language.service.js';
import { TSHTMLLanguageService } from '../services/languages/tshtml-language.service.js';
import { ProjectsService } from '../services/projects.service.js';
import { SemanticsService } from '../services/semantics.service.js';
import { SettingsService } from '../services/settings.service.js';
import { CodeContext } from '../visitors/code/code-context.js';
import { CodeVisitor } from '../visitors/code/code-visitor.js';
import { SemanticTokenContext } from '../visitors/semantics/semantic-token-context.js';
import { SemanticTokenVisitor } from '../visitors/semantics/semantic-token-visitor.js';
import { StyleContext } from '../visitors/styles/style-context.js';
import { StyleVisitor } from '../visitors/styles/style-visitor.js';
import { ColorPresentation } from './color-presentation.js';
import { CssRegion } from './css-region.js';
import { VisitorContext } from './visitor-context.js';

export class ServerContext {
    public document: TextDocument | null = null;
    public documentUri: string = StringExtensions.empty;
    public documentVersion: number = 0;
    public parserResult: ParserResult | null = null;
    public semanticTokens: number[] = [];
    public colorPresentations: ColorPresentation[] = [];
    public cssDocument: string = StringExtensions.empty;
    public cssRegions: CssRegion[] = [];
    public codeDocument: string = StringExtensions.empty;
    public codeRegions: CodeValueSyntaxNode[] = [];

    public semanticTokensContext = new SemanticTokenContext(this);
    public styleContext = new StyleContext(this);
    public codeContext = new CodeContext();

    public readonly projectsService: ProjectsService = new ProjectsService(this);
    public readonly connectionService: ConnectionService = new ConnectionService(this);
    public readonly documentsService: DocumentsService = new DocumentsService(this);
    public readonly diagnosticsService: DiagnosticsService = new DiagnosticsService(this);
    public readonly semanticsService: SemanticsService = new SemanticsService(this);
    public readonly completionsService: CompletionsService = new CompletionsService(this);
    public readonly settingsService: SettingsService = new SettingsService(this);

    public readonly htmlLanguageService: HtmlLanguageService = new HtmlLanguageService(this);
    public readonly cssLanguageService: CSSLanguageService = new CSSLanguageService(this);
    public readonly tshtmlLanguageService: TSHTMLLanguageService = new TSHTMLLanguageService(this);
    public readonly codeLanguageService: CodeLanguageService = new CodeLanguageService(this);

    public listen(): void {
        this.documentsService.listen();
        this.connectionService.listen();
    }

    public processParserResult(parserResult: ParserResult): void {
        if (ObjectExtensions.isNullOrUndefined(parserResult))
            return;

        const visitors = [
            StyleVisitor.create(this),
            CodeVisitor.create(this),
            SemanticTokenVisitor.create(this)
        ];

        const context = new VisitorContext(visitors);

        for (const node of parserResult.nodes)
            node.visit(context);

        this.colorPresentations = this.styleContext.getColors();
        this.cssDocument = this.styleContext.getDocument();
        this.cssRegions = this.styleContext.getRegions();
        this.codeDocument = this.codeContext.getCodeDocument();
        this.codeRegions = this.codeContext.getRegions();

        this.semanticTokens = this.semanticTokensContext.getData();
    }
}