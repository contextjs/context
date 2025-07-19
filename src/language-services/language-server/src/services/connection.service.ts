/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import {
    Connection,
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    ProposedFeatures,
    TextDocumentSyncKind
} from 'vscode-languageserver/node.js';

import { Console } from '@contextjs/system';
import { Constants } from '../constants.js';
import { ServerContext } from '../models/server-context.js';
import { SEMANTIC_TOKEN_LEGEND } from '../models/syntax-node-type.js';

export class ConnectionService {
    public hasConfigurationCapability = false;
    public hasWorkspaceFolderCapability = false;

    public readonly connection: Connection = (createConnection as any)(process.stdin, process.stdout, ProposedFeatures.all);

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
                    colorProvider: true,
                    completionProvider: { triggerCharacters: ['>', '/'], resolveProvider: false },
                    executeCommandProvider: {
                        commands: ['insertSnippet']
                    },
                    semanticTokensProvider: {
                        full: true,
                        documentSelector: [{ scheme: 'file', language: Constants.LANGUAGE }],
                        legend: { tokenTypes: SEMANTIC_TOKEN_LEGEND, tokenModifiers: [] }
                    }
                }
            };

            if (this.hasWorkspaceFolderCapability)
                result.capabilities.workspace = { workspaceFolders: { supported: true } };

            return result;
        });

        this.connection.onInitialized(async () => {
            if (this.hasConfigurationCapability)
                this.connection.client.register(DidChangeConfigurationNotification.type, undefined);

            await this.context.settingsService.update();
        });

        this.connection.onDidChangeConfiguration(async (change) => {
            await this.context.settingsService.update();
            this.context.settingsService.handleDidChangeConfiguration(change);
            this.connection.languages.diagnostics.refresh();
        });

        this.connection.onDocumentColor(() => {
            return this.context.cssLanguageService.onDocumentColor();
        });

        this.connection.onColorPresentation((params) => {
            return this.context.cssLanguageService.onColorPresentation(params);
        });
    }
}