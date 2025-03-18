/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ObjectExtensions, ProjectType } from "@contextjs/core";
import { FileTemplate } from "../models/file-template.mjs";
import { ContextTemplate } from "../templates/api/context.json.template.mjs";
import { PackageTemplate } from "../templates/api/package.json.template.mjs";
import { ProgramTemplate } from "../templates/api/program.ts.template.mjs";
import { TsConfigTemplate } from "../templates/tsconfig.json.template.mjs";

export class TemplateService {
    public static fromProjectType(projectType: ProjectType): FileTemplate[] {
        if (ObjectExtensions.isNullOrUndefined(projectType))
            return [];

        switch (projectType) {
            case ProjectType.API:
                return TemplateService.api;
            default:
                return [];
        }
    }

    public static api: FileTemplate[] = [
        TsConfigTemplate.template,
        ContextTemplate.template,
        PackageTemplate.template,
        ProgramTemplate.template
    ];
}