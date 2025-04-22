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
    private readonly packageInfo: PackageInfo = { name: "system" };

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageInfo);
        await this.copyReadmeFileAsync(this.packageInfo);
        await this.setVersionAsync();
        await this.executeCommandAsync(`cd src/${this.packageInfo.name} && tsc`);
    }

    private async setVersionAsync() {
        const file = (await this.readFileAsync(`src/${this.packageInfo.name}/src/services/version.service.ts`))
            .replace(/private static readonly version: string = ".*";/, `private static readonly version: string = "${Config.version}";`);
        await this.writeFileAsync(`src/${this.packageInfo.name}/src/services/version.service.ts`, file);
    }
}

await new Build().runAsync();