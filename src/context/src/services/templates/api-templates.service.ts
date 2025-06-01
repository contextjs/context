import { Console, VersionService } from "@contextjs/system";
import { FileTemplate } from "../../models/file-template.js";
import { ContextTemplate } from "../../templates/api/context.ctxp.template.js";
import { PackageTemplate } from "../../templates/api/package.json.template.js";
import { MainTemplate } from "../../templates/api/main.ts.template.js";
import { TsConfigTemplate } from "../../templates/tsconfig.json.template.js";
import { TemplatesService } from "./templates.service.js";
import { ServiceCollectionExtensionsTemplate } from "../../templates/api/services/service-collection.extensions.template.js";
import { LoggerServiceTemplate } from "../../templates/api/services/logger.service.template.js";
import { MessageServiceTemplate } from "../../templates/api/services/message.service.template.js";
import { ILoggerServiceTemplate } from "../../templates/api/services/interfaces/i-logger.service.template.js";
import { IMessageServiceTemplate } from "../../templates/api/services/interfaces/i-message.service.template.js";
import { AboutControllerTemplate } from "../../templates/api/controllers/about.controller.ts.template.js";
import { HomeControllerTemplate } from "../../templates/api/controllers/home.controller.ts.template.js";

export class APITemplatesService extends TemplatesService {
    protected override readonly helpText = `The "ctx new api" command creates a Web API project based on a template.
Usage: ctx new api [options]

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
        HomeControllerTemplate.template
    ];
}