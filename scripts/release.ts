/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Config from "./config.ts";
import type PackageInfo from "./package-info.ts";
import Script from "./script.ts";

export class Release extends Script {
    public async runAsync(): Promise<void> {
        try {
            const packagesInfo = await this.getPackagesInfoAsync();
            await this.executeActionAsync(packagesInfo, this.publishPackageAsync.bind(this));
        }
        catch (error) {
            console.log(error);
        }
    }

    private async publishPackageAsync(packageInfo: PackageInfo): Promise<void> {
        if (packageInfo.disableNPM)
            return;

        await this.writeLogAsync(`Publishing "${packageInfo.name}"...`);
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageInfo.name} && npm publish --provenance --access public && cd .. && cd ..`);
        await this.writeLogAsync(`Publishing "${packageInfo.name}"... Done`);
    }
}

await new Release().runAsync();