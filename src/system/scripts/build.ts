/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Config from '../../../scripts/config.ts';
import type PackageInfo from '../../../scripts/package-info.ts';
import Script from '../../../scripts/script.ts';

export class Build extends Script {
    public override async runAsync(packageInfo: PackageInfo): Promise<void> {
        await this.copyDeclarationsFileAsync(packageInfo);
        await this.copyReadmeFileAsync(packageInfo);
        await this.setVersionAsync(packageInfo);
        await this.executeCommandAsync(`cd src/${packageInfo.name} && tsc`);
    }

    private async setVersionAsync(packageInfo: PackageInfo) {
        const file = (await this.readFileAsync(`src/${packageInfo.path}/src/services/version.service.ts`))
            .replace(/private static readonly version: string = ".*";/, `private static readonly version: string = "${Config.version}";`);
        await this.writeFileAsync(`src/${packageInfo.path}/src/services/version.service.ts`, file);
    }
}