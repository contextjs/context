import { LanguageExtensions, Parser } from '@contextjs/views-parser';
import { ObjectExtensions, StringExtensions } from '@contextjs/system';
import * as url from 'node:url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ServerContext } from '../server-context.js';

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
        }
        catch (error) {
            this.context.document = null;
            this.context.parserResult = null;
            console.error(`Error parsing document: ${error}`);
        }
    }

    public reset(): void {
        this.context.document = null;
        this.context.parserResult = null;
    }
}