/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CompletionList, TextDocumentPositionParams } from "vscode-languageserver/node.js";
import { ServerContext } from "../../../models/server-context.js";

export interface ILanguageService {
    context: ServerContext;
    complete(position: TextDocumentPositionParams, ...parameters: any[]): CompletionList;
}