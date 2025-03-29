/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ProjectType } from "@contextjs/system";
import { APITemplatesService } from "./api-templates.service.js";
import { TemplatesService } from "./templates.service.js";

export class TemplatesServiceResolver {
    public static async resolveAsync(projectType: ProjectType): Promise<TemplatesService | null> {
        switch (projectType) {
            case ProjectType.API:
                return new APITemplatesService();
            default:
                return null;
        }
    }
}