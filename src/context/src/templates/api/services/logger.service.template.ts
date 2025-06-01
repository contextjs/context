/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../models/file-template.js";

export class LoggerServiceTemplate {
    private static readonly name = "src/services/logger.service.ts";
    private static readonly content = `import { ILoggerService } from "./interfaces/i-logger.service.js";

export class LoggerService implements ILoggerService {
    log(message: string): void {
        console.log(message);
    }
}`

    public static readonly template: FileTemplate = new FileTemplate(LoggerServiceTemplate.name, LoggerServiceTemplate.content);
}