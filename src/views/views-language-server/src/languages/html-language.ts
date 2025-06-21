// import { CompletionList, getLanguageService, HTMLDocument, LanguageService, Position } from 'vscode-html-languageservice';
// import { TextDocumentPositionParams, WorkspaceChange } from 'vscode-languageserver';
// import { TextDocument } from "vscode-languageserver-textdocument";
// import { ServerContext } from '../server-context';
// import { ILanguage } from "./i-language";

// export class HtmlLanguage implements ILanguage {
//     private service: LanguageService = getLanguageService();
//     private htmlDocument: HTMLDocument | null = null;
//     public context: ServerContext;
//     public readonly id: string = "html";

//     public constructor(context: ServerContext) {
//         this.context = context;
//     }

//     public complete(node, document: TextDocument, position: TextDocumentPositionParams): CompletionList {
//         this.htmlDocument = this.service.parseHTMLDocument(document);
//         if (this.completeTag(document, position.position) === false)
//             return this.service.doComplete(document, position.position, this.htmlDocument);
//     }

//     private completeTag(document: TextDocument, position: Position): boolean {
//         let tagCompletion = this.service.doTagComplete(document, position, this.htmlDocument);
//         if (tagCompletion !== null) {
//             tagCompletion = tagCompletion.replace('$0', '');
//             const workspaceChange = new WorkspaceChange();
//             const change = workspaceChange.getTextEditChange(document);
//             change.insert(position, tagCompletion);
//             this.context.connectionService.connection.workspace.applyEdit(workspaceChange.edit);

//             return true;
//         }

//         return false;
//     }
// }