/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CodeValueSyntaxNode } from "@contextjs/views-parser";
import { CompletionList, Position, TextDocumentPositionParams } from "vscode-languageserver/node.js";
import { ServerContext } from "../../../models/server-context.js";
import { SemanticToken } from "../../../visitors/semantics/semantic-token.js";

export interface ICodeLanguageService {
    context: ServerContext;
    complete(position: TextDocumentPositionParams, ...parameters: any[]): CompletionList;
    getRegion(position: Position): CodeValueSyntaxNode | null;
    getSemanticTokens(node: CodeValueSyntaxNode): SemanticToken[];
}