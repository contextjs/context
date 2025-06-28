import { Console, VersionService } from "@contextjs/system";
import { FileTemplate } from "../../models/file-template.js";
import { TsConfigTemplate } from "../../templates/tsconfig.json.template.js";
import { ContextTemplate } from "../../templates/views/context.ctxp.template.js";
import { AboutControllerTemplate } from "../../templates/views/controllers/about.controller.ts.template.js";
import { HomeControllerTemplate } from "../../templates/views/controllers/home.controller.ts.template.js";
import { MainTemplate } from "../../templates/views/main.ts.template.js";
import { PackageTemplate } from "../../templates/views/package.json.template.js";
import { ILoggerServiceTemplate } from "../../templates/views/services/interfaces/i-logger.service.template.js";
import { IMessageServiceTemplate } from "../../templates/views/services/interfaces/i-message.service.template.js";
import { LoggerServiceTemplate } from "../../templates/views/services/logger.service.template.js";
import { MessageServiceTemplate } from "../../templates/views/services/message.service.template.js";
import { ServiceCollectionExtensionsTemplate } from "../../templates/views/services/service-collection.extensions.template.js";
import { AboutControllerIndexViewTemplate } from "../../templates/views/views/about/index.tshtml.template.js";
import { HomeControllerIndexViewTemplate } from "../../templates/views/views/home/index.tshtml.template.js";
import { TemplatesService } from "./templates.service.js";

export class ViewsTemplatesService extends TemplatesService {
    protected override readonly helpText = `The "ctx new views" command creates a Views project based on a template.
Usage: ctx new views [options]

Options             Description
------------        -----------------------------------------------------
[no option]         Creates a project with current directory name as project name.
-n, --name          The name of the project to create.
`;

    public override async displayHelpAsync(): Promise<void> {
        VersionService.display();
        Console.writeLine(this.helpText);
        return process.exit(0);
    }

    public override templates: FileTemplate[] = [
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