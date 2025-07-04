/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";
import { ContextTemplate } from "../../templates/api/context.ctxp.template.js";
import { AboutControllerTemplate } from "../../templates/api/controllers/about.controller.ts.template.js";
import { HomeControllerTemplate } from "../../templates/api/controllers/home.controller.ts.template.js";
import { MainTemplate } from "../../templates/api/main.ts.template.js";
import { PackageTemplate } from "../../templates/api/package.json.template.js";
import { ILoggerServiceTemplate } from "../../templates/api/services/interfaces/i-logger.service.template.js";
import { IMessageServiceTemplate } from "../../templates/api/services/interfaces/i-message.service.template.js";
import { LoggerServiceTemplate } from "../../templates/api/services/logger.service.template.js";
import { MessageServiceTemplate } from "../../templates/api/services/message.service.template.js";
import { ServiceCollectionExtensionsTemplate } from "../../templates/api/services/service-collection.extensions.template.js";
import { TsConfigTemplate } from "../../templates/tsconfig.json.template.js";

export class WebAPITemplateService {
    public templates: FileTemplate[] = [
        TsConfigTemplate.template,
        ContextTemplate.template,
        PackageTemplate.template,
        MainTemplate.template,
        LoggerServiceTemplate.template,
        MessageServiceTemplate.template,
        ServiceCollectionExtensionsTemplate.template,
        ILoggerServiceTemplate.template,
        IMessageServiceTemplate.template,
        AboutControllerTemplate.template,
        HomeControllerTemplate.template
    ];
}