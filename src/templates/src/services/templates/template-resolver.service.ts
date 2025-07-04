/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { WebAPITemplateService } from "./webapi-template.service.js";
import { TemplateService } from "./template.service.js";

export class TemplateResolverService {
    public static async resolveAsync(type: string): Promise<TemplateService | null> {
        switch (type) {
            case "webapi":
                return new WebAPITemplateService();
            default:
                return null;
        }
    }
}