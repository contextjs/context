/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ProjectType } from "@contextjs/system";

export interface IViewsCompilerOptions {
    projectRoot: string;
    files: string[];
    projectType: ProjectType;
}