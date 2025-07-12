/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */


// import { CompletionList, getCSSLanguageService, LanguageService, Stylesheet } from 'vscode-css-languageservice';
// import { TextDocument } from "vscode-languageserver-textdocument";
// import { TextDocumentPositionParams } from 'vscode-languageserver/node';
// import { ServerContext } from '../server-context';
// import { ILanguage } from "./i-language";

// export class CSSLanguage implements ILanguage {
//     private service: LanguageService = getCSSLanguageService();
//     private stylesheet: Stylesheet | null = null;
//     public context: ServerContext;
//     public readonly id: string = "css";

//     public constructor(context: ServerContext) {
//         this.context = context;
//     }

//     public complete(node, document: TextDocument, position: TextDocumentPositionParams): CompletionList {
//         const docText = this.replaceExcept(document.getText(), [node.node.text]);
//         const clone = TextDocument.create(document.uri, 'css', document.version, docText);
//         this.stylesheet = this.service.parseStylesheet(clone);
//         const ddd =  this.service.doComplete(document, position.position, this.stylesheet);
//         return ddd;
//     }

//     private replaceExcept(input: string, toExcludeArray: string[]): string {
//         // Escape and join all strings in the exclusion array to create a regex
//         const escapedPatterns = toExcludeArray.map(str =>
//             str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
//         );
//         const regex = new RegExp(escapedPatterns.join('|'), 'gs'); // Join with OR `|` operator

//         // Replace everything except newlines with spaces
//         let result = input.replace(/./gs, (char) => (char === '\n' ? '\n' : ' '));

//         // Reinsert each excluded block back into the result
//         toExcludeArray.forEach((block) => {
//             const index = input.indexOf(block);
//             if (index !== -1) {
//                 result = result.slice(0, index) + block + result.slice(index + block.length);
//             }
//         });

//         return result;
//     }
// }