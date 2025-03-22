/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ObjectExtensions, ProjectType } from "@contextjs/core";
import { FileTemplate } from "../models/file-template.js";
import { ContextTemplate } from "../templates/api/context.json.template.js";
import { PackageTemplate } from "../templates/api/package.json.template.js";
import { ProgramTemplate } from "../templates/api/program.ts.template.js";
import { TsConfigTemplate } from "../templates/tsconfig.json.template.js";

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