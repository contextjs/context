import path from 'path';
import * as vscode from 'vscode';

import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node.js';
import { Constants } from './constants.js';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    const nodePath = process.execPath;
    const serverPath = context.asAbsolutePath(path.join('node_modules', '@contextjs', 'language-server', 'server.js'));

    const serverOptions: ServerOptions = {
        run: { command: nodePath, args: [serverPath], transport: TransportKind.stdio },
        debug: { command: nodePath, args: [serverPath, '--inspect=6009'], transport: TransportKind.stdio }
    };

    const clientOptions = { documentSelector: [{ scheme: 'file', language: "contextjs" }] };

    client = new LanguageClient(Constants.LANGUAGE_NAME, Constants.SERVER_NAME, serverOptions, clientOptions);

    interface InsertSnippetParams {
        snippet: string;
        position: { line: number; character: number };
        uri: string;
    }

    interface ExecuteCommandParams {
        command: string;
        arguments: [InsertSnippetParams];
    }

    client.onRequest('workspace/executeCommand', async (params: ExecuteCommandParams) => {
        if (params.command === 'insertSnippet') {
            const { snippet, position, uri } = params.arguments[0];
            const editor = vscode.window.activeTextEditor;

            if (editor && editor.document.uri.toString() === uri) {
                await editor.insertSnippet(
                    new vscode.SnippetString(snippet),
                    new vscode.Position(position.line, position.character)
                );
            }
        }
    });

    client.start();
}

export function deactivate() {
    if (!client)
        return undefined;

    return client.stop();
}