/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */


import { CompletionList, getLanguageService, HTMLDocument, LanguageService, Position } from 'vscode-html-languageservice';
import { TextDocumentPositionParams, WorkspaceChange } from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";
import { ServerContext } from '../../models/server-context.js';
import { ILanguageService } from "./interfaces/i-language.service.js";

export class HtmlLanguageService implements ILanguageService {
    private service: LanguageService = getLanguageService();
    private htmlDocument: HTMLDocument | null = null;
    public context: ServerContext;
    public readonly id: string = "html";

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public complete(node: any, document: TextDocument, position: TextDocumentPositionParams): CompletionList {
        this.htmlDocument = this.service.parseHTMLDocument(document);

        if (this.completeTag(document, position.position) === false)
            return this.service.doComplete(document, position.position, this.htmlDocument);

        return { isIncomplete: true, items: [] };
    }

    private completeTag(document: TextDocument, position: Position): boolean {
        let tagCompletion = this.service.doTagComplete(document, position, this.htmlDocument!);
        if (tagCompletion !== null) {
            tagCompletion = tagCompletion.replace('$0', '');
            const workspaceChange = new WorkspaceChange();
            const change = workspaceChange.getTextEditChange(document);
            change.insert(position, tagCompletion);
            this.context.connectionService.connection.workspace.applyEdit(workspaceChange.edit);

            return true;
        }

        return false;
    }
}