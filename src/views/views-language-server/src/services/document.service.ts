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
            const uri = event.document.uri;

            const oldTimeout = this.debounceTimeouts.get(uri);
            if (!ObjectExtensions.isNullOrUndefined(oldTimeout))
                clearTimeout(oldTimeout);

            const timeout = setTimeout(() => {
                this.context.parserService.parse(event.document);
                const diagnostics = this.context.diagnosticsService.analyse();
                if (diagnostics)
                    this.context.connectionService.connection.sendDiagnostics(diagnostics);
                else
                    this.context.connectionService.connection.sendDiagnostics({ uri, diagnostics: [] });

                this.debounceTimeouts.delete(uri);
            }, this.debounceDelay);

            this.debounceTimeouts.set(uri, timeout);
        });
    }
}