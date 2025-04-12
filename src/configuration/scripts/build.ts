/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Script from '../../../scripts/script.ts';

export class Build extends Script {
    private readonly packageName: string = "configuration";

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageName);
        await this.copyReadmeFileAsync(this.packageName);
        await this.executeCommandAsync(`cd src/${this.packageName} && tsc`);
    }
}

await new Build().runAsync();