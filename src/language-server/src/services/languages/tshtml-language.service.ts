/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */


import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionList, TextDocumentPositionParams } from 'vscode-languageserver/node.js';
import { ServerContext } from '../../models/server-context.js';
import { ILanguageService } from "./interfaces/i-language.service.js";

export class TSHTMLLanguageService implements ILanguageService {
    public context: ServerContext;
    public readonly id: string = "tshtml";

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public complete(node: any, document: TextDocument, position: TextDocumentPositionParams) {
        return CompletionList.create([]);
    }
}