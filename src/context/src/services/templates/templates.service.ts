/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";

export abstract class TemplatesService {
    protected abstract readonly helpText: string;
    public abstract displayHelpAsync(): Promise<void>;
    public abstract templates: FileTemplate[];
}