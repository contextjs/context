import { ConsoleService, VersionService } from "@contextjs/core";
import { FileTemplate } from "../../models/file-template.js";
import { ContextTemplate } from "../../templates/api/context.ctxp.template.js";
import { PackageTemplate } from "../../templates/api/package.json.template.js";
import { ProgramTemplate } from "../../templates/api/program.ts.template.js";
import { TsConfigTemplate } from "../../templates/tsconfig.json.template.js";
import { TemplatesService } from "./templates.service.js";

export class APITemplatesService extends TemplatesService {
    protected override readonly helpText = `The "ctx new api" command creates a Web API project based on a template.
Usage: ctx new api [options]

Options             Description
------------        -----------------------------------------------------
-n, --name          The name of the project to create.
`;

    public override async displayHelpAsync(): Promise<void> {
        VersionService.display();
        ConsoleService.writeLine(this.helpText);
        return process.exit(0);
    }

    public override templates: FileTemplate[] = [
        TsConfigTemplate.template,
        ContextTemplate.template,
        PackageTemplate.template,
        ProgramTemplate.template
    ];
}