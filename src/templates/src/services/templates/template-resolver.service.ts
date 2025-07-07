/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { MVCTemplatesService } from "./mvc-templates.service.js";
import { TemplateService } from "./template.service.js";
import { WebAPITemplateService } from "./webapi-template.service.js";

export class TemplateResolverService {
    public static async resolveAsync(type: string): Promise<TemplateService | null> {
        switch (type) {
            case "webapi":
                return new WebAPITemplateService();
            case "mvc":
                return new MVCTemplatesService();
            default:
                return null;
        }
    }
}