/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IProviderManifest } from "./i-provider-manifest.js";

export interface IProviderWithRootManifest extends IProviderManifest {
    root: string;
}