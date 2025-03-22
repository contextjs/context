/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import Config from "./config.ts";
import Script from "./script.ts";

export class Release extends Script {
    public async runAsync(): Promise<void> {
        try {
            const packageNames = await this.getPackageNamesAsync();

            for (let packageName of packageNames)
                await this.publishPackageAsync(packageName);
        }
        catch (error) {
            console.log(error);
        }
    }

    private async publishPackageAsync(packageName: string): Promise<void> {
        await this.writeLogAsync(`Publishing "${packageName}"...`);
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageName} && npm publish --provenance --access public && cd .. && cd ..`);
        await this.writeLogAsync(`Publishing "${packageName}"... Done`);
    }
}

await new Release().runAsync();