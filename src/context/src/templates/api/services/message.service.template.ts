/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../models/file-template.js";

export class MessageServiceTemplate {
    private static readonly name = "src/services/message.service.ts";
    private static readonly content = `import { IMessageService } from "./interfaces/i-message.service.js";

export class MessageService implements IMessageService {
    display(message: string): string {
        return message;
    }
}`

    public static readonly template: FileTemplate = new FileTemplate(MessageServiceTemplate.name, MessageServiceTemplate.content);
}