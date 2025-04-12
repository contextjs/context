/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Config from '../../../scripts/config.ts';
import Script from '../../../scripts/script.ts';

export class Build extends Script {
    private readonly packageName: string = "system";

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageName);
        await this.copyReadmeFileAsync(this.packageName);
        await this.setVersionAsync();
    }

    private async setVersionAsync() {
        const file = (await this.readFileAsync(`src/${this.packageName}/src/services/version.service.ts`))
            .replace(/private static readonly version: string = ".*";/, `private static readonly version: string = "${Config.version}";`);
        await this.writeFileAsync(`src/${this.packageName}/src/services/version.service.ts`, file);

        await this.executeCommandAsync(`cd src/${this.packageName} && tsc`);
    }
}

await new Build().runAsync();