/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../../models/file-template.js";

export class ILoggerServiceTemplate {
    private static readonly name = "src/services/interfaces/i-logger.service.ts";
    private static readonly content = `export interface ILoggerService {
    log(message: string): void;
}`;

    public static readonly template: FileTemplate = new FileTemplate(ILoggerServiceTemplate.name, ILoggerServiceTemplate.content);
}