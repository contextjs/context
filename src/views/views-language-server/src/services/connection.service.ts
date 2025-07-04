import {
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    TextDocumentSyncKind
} from 'vscode-languageserver/node.js';
import { ServerContext } from '../server-context.js';

export class ConnectionService {
    private hasConfigurationCapability = false;
    private hasWorkspaceFolderCapability = false;
    public readonly connection = createConnection();

    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    public listen() {
        this.connection.listen();
    }

    private setupEvents() {
        this.connection.onInitialize((params: InitializeParams) => {
            const capabilities = params.capabilities;

            this.hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
            this.hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

            const result: InitializeResult = {
                capabilities: {
                    textDocumentSync: TextDocumentSyncKind.Incremental,
                    //completionProvider: { triggerCharacters: [">"], resolveProvider: false },
                    // semanticTokensProvider: {
                    //     full: false,
                    //     range: true,
                    //     documentSelector: [{ language: 'context' }],
                    //     legend: { tokenTypes: ['markupElement'], tokenModifiers: [] }
                    // }
                }
            };

            if (this.hasWorkspaceFolderCapability)
                result.capabilities.workspace = { workspaceFolders: { supported: true } };

            return result;
        });

        this.connection.onInitialized(() => {
            if (this.hasConfigurationCapability)
                this.connection.client.register(DidChangeConfigurationNotification.type, undefined);
        });

        this.connection.onDidChangeConfiguration(() => {
            this.connection.languages.diagnostics.refresh();
        });
    }
}