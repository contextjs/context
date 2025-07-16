/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import * as url from 'node:url';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import { LanguageExtensions, Parser } from '@contextjs/views-parser';
import { ServerContext } from '../models/server-context.js';

export class ParserService {
    public constructor(private readonly context: ServerContext) { }

    public parse(document: TextDocument): void {
        if (ObjectExtensions.isNullOrUndefined(document))
            return;

        const localPath = url.fileURLToPath(document.uri);
        if (StringExtensions.isNullOrWhitespace(localPath))
            return;

        const fileExtension = localPath.split('.').pop()?.toLowerCase();
        if (StringExtensions.isNullOrWhitespace(fileExtension))
            return;

        const language = LanguageExtensions.fromString(fileExtension);
        if (ObjectExtensions.isNullOrUndefined(language))
            return;

        try {
            this.context.document = document;
            this.context.parserResult = Parser.parse(document.getText(), language);

            this.context.visitParserResult();
        }
        catch (error) {
            this.context.document = null;
            this.context.parserResult = null;
            console.error(`Error parsing document: ${error}`);
        }
    }
}