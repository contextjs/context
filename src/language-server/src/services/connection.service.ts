/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from '@contextjs/system';
import {
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    ProposedFeatures,
    TextDocumentSyncKind
} from 'vscode-languageserver/node.js';
import { Constants } from '../constants.js';
import { SEMANTIC_TOKEN_LEGEND } from '../semantics/semantic-token-type.js';
import { ServerContext } from '../server-context.js';

export class ConnectionService {
    private hasConfigurationCapability = false;
    private hasWorkspaceFolderCapability = false;
    public readonly connection = (createConnection as any)(process.stdin, process.stdout, ProposedFeatures.all);

    public constructor(private readonly context: ServerContext) {
        this.setupEvents();
    }

    public listen() {
        this.connection.listen();
        Console.setOutput((...args: any[]) => { process.stderr.write(args.map(String).join(' ') + '\n'); });
        Console.writeLineInfo('ContextJS Language Server is listening for connections...');
        Console.resetOutput();
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
                    semanticTokensProvider: {
                        full: true,
                        range: false,
                        documentSelector: [{ scheme: 'file', language: Constants.LANGUAGE }],
                        legend: { tokenTypes: SEMANTIC_TOKEN_LEGEND, tokenModifiers: [] }
                    }
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