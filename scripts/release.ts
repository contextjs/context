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
    private publishCommand: string;

    public async runAsync(): Promise<void> {
        try {
            this.publishCommand = this.getPublishCommand();
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
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageInfo.name} && ${this.publishCommand} && cd .. && cd ..`);
        await this.writeLogAsync(`Publishing "${packageInfo.name}"... Done`);
    }

    private getPublishCommand(): string {
        const version = Config.version;
        const match = version.match(/^[0-9]+\.[0-9]+\.[0-9]+-([a-zA-Z0-9]+)(\.\d+)?/);
        if (match)
            return `npm publish --tag ${match[1]} --provenance --access public`;
        else
            return `npm publish --provenance --access public`;
    }

}

await new Release().runAsync();