/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../../models/file-template.js";

export class IMessageServiceTemplate {
    private static readonly name = "src/services/interfaces/i-message.service.ts";
    private static readonly content = `export interface IMessageService {
    display(message: string): string;
}`;

    public static readonly template: FileTemplate = new FileTemplate(IMessageServiceTemplate.name, IMessageServiceTemplate.content);
}