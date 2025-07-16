/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */


import { TextDocument } from "vscode-languageserver-textdocument";
import { CompletionList, TextDocumentPositionParams } from "vscode-languageserver/node.js";
import { ServerContext } from "../../../models/server-context.js";

export interface ILanguageService {
    id: string;
    context: ServerContext;
    complete(node: any, document: TextDocument, position: TextDocumentPositionParams): CompletionList;
}