/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import type PackageInfo from '../../../scripts/package-info.ts';
import Script from '../../../scripts/script.ts';

export class Build extends Script {
    public override async runAsync(packageInfo: PackageInfo): Promise<void> {
        await this.copyProviderManifestFile(packageInfo);
        await this.copyReadmeFileAsync(packageInfo);
        await this.executeCommandAsync(`cd src/${packageInfo.name} && tsc`);
    }
}