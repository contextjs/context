import { FileTemplate } from "../../models/file-template.js";
import { ContextTemplate } from "../../templates/mvc/context.ctxp.template.js";
import { AboutControllerTemplate } from "../../templates/mvc/controllers/about.controller.ts.template.js";
import { HomeControllerTemplate } from "../../templates/mvc/controllers/home.controller.ts.template.js";
import { MainTemplate } from "../../templates/mvc/main.ts.template.js";
import { PackageTemplate } from "../../templates/mvc/package.json.template.js";
import { ILoggerServiceTemplate } from "../../templates/mvc/services/interfaces/i-logger.service.template.js";
import { IMessageServiceTemplate } from "../../templates/mvc/services/interfaces/i-message.service.template.js";
import { LoggerServiceTemplate } from "../../templates/mvc/services/logger.service.template.js";
import { MessageServiceTemplate } from "../../templates/mvc/services/message.service.template.js";
import { ServiceCollectionExtensionsTemplate } from "../../templates/mvc/services/service-collection.extensions.template.js";
import { AboutControllerIndexViewTemplate } from "../../templates/mvc/views/about/index.tshtml.template.js";
import { HomeControllerIndexViewTemplate } from "../../templates/mvc/views/home/index.tshtml.template.js";
import { TsConfigTemplate } from "../../templates/tsconfig.json.template.js";

export class MVCTemplatesService {
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
        HomeControllerTemplate.template,
        HomeControllerIndexViewTemplate.template,
        AboutControllerIndexViewTemplate.template
    ];
}