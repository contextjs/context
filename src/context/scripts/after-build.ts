/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { PackageInfo } from '../../../scripts/package-info.ts';
import Script from '../../../scripts/script.ts';

export class AfterBuild extends Script {
    private readonly contextTransformersPath = 'src/context/src/transformers';

    public override async runAsync(packageInfo: PackageInfo): Promise<void> {
        this.removeDirectoryAsync(this.contextTransformersPath);
    }
}