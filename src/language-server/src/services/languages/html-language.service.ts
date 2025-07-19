/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import { CompletionList, getLanguageService, HTMLDocument, LanguageService, Position } from 'vscode-html-languageservice';
import { CompletionItem, CompletionItemKind, InsertTextFormat, TextDocumentPositionParams, WorkspaceChange } from 'vscode-languageserver';
import { TextDocument } from "vscode-languageserver-textdocument";
import { ServerContext } from '../../models/server-context.js';
import { CursorPosition } from '../../models/settings.js';
import { ILanguageService } from "./interfaces/i-language.service.js";

export class HtmlLanguageService implements ILanguageService {
    private service: LanguageService = getLanguageService();
    private htmlDocument!: HTMLDocument;

    public context: ServerContext;

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public complete(position: TextDocumentPositionParams): CompletionList {
        const document = this.context.documentsService.documents.get(position.textDocument.uri);
        if (ObjectExtensions.isNullOrUndefined(document))
            return { isIncomplete: false, items: [] };

        this.context.documentsService.parseDocument(document);
        this.htmlDocument = this.service.parseHTMLDocument(document);

        const settings = this.context.settingsService.settings;
        if (settings.autocomplete.mode === "Edit" && this.completeTag(document, position.position, settings.autocomplete.cursorPosition))
            return { isIncomplete: false, items: [] };

        if (settings.autocomplete.mode === "Completion") {
            const item = this.getTagCompletionItem(document, position.position, settings.autocomplete.cursorPosition);
            if (!ObjectExtensions.isNullOrUndefined(item))
                return { isIncomplete: false, items: [item] };
        }

        return this.service.doComplete(document, position.position, this.htmlDocument);
    }

    private getTagCompletionItem(document: TextDocument, position: Position, cursorPosition: CursorPosition): CompletionItem | null {
        let tagCompletion = this.service.doTagComplete(document, position, this.htmlDocument!);
        if (StringExtensions.isNullOrWhitespace(tagCompletion))
            return null;

        if (cursorPosition === "Between") {
            if (!tagCompletion.includes('$0'))
                tagCompletion = tagCompletion.replace('</', '$0</');
        }
        else
            tagCompletion = tagCompletion.replace('$0', '') + '$0';

        return {
            label: tagCompletion.replace(/\$0/g, ''),
            kind: CompletionItemKind.Snippet,
            insertText: tagCompletion,
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: 'Auto-complete closing tag'
        };
    }

    private completeTag(document: TextDocument, position: Position, cursorPosition: CursorPosition): boolean {
        let tagCompletion = this.service.doTagComplete(document, position, this.htmlDocument);

        if (!StringExtensions.isNullOrWhitespace(tagCompletion)) {
            if (cursorPosition === "Between") {
                if (!tagCompletion.includes('$0'))
                    tagCompletion = tagCompletion.replace('</', '$0</');
            }
            else
                tagCompletion = tagCompletion.replace('$0', '') + '$0';
            this.context.connectionService.connection.sendRequest('workspace/executeCommand', {
                command: 'insertSnippet',
                arguments: [{
                    snippet: tagCompletion,
                    position,
                    uri: document.uri
                }]
            });

            return true;
        }

        return false;
    }
}