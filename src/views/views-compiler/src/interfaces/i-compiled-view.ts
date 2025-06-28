/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Diagnostic } from "../models/diagnostic.js";

export interface ICompiledView {
    filePath: string;
    className: string;
    esmSource: string;
    esmSourceMap?: string;
    diagnostics?: Diagnostic[];
}