/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";
import { ContextTemplate } from "../../templates/webapi/context.ctxp.template.js";
import { AboutControllerTemplate } from "../../templates/webapi/controllers/about.controller.ts.template.js";
import { HomeControllerTemplate } from "../../templates/webapi/controllers/home.controller.ts.template.js";
import { MainTemplate } from "../../templates/webapi/main.ts.template.js";
import { PackageTemplate } from "../../templates/webapi/package.json.template.js";
import { ILoggerServiceTemplate } from "../../templates/webapi/services/interfaces/i-logger.service.template.js";
import { IMessageServiceTemplate } from "../../templates/webapi/services/interfaces/i-message.service.template.js";
import { LoggerServiceTemplate } from "../../templates/webapi/services/logger.service.template.js";
import { MessageServiceTemplate } from "../../templates/webapi/services/message.service.template.js";
import { ServiceCollectionExtensionsTemplate } from "../../templates/webapi/services/service-collection.extensions.template.js";
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