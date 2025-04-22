/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import type PackageInfo from '../../../../scripts/package-info.ts';
import Script from '../../../../scripts/script.ts';

export class Build extends Script {
    private readonly packageInfo: PackageInfo = { name: "webserver-middleware-static", path: "webserver" };

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageInfo);
        await this.copyReadmeFileAsync(this.packageInfo);
        await this.executeCommandAsync(`cd src/${this.packageInfo.path}/${this.packageInfo.name} && tsc`);
    }
}

await new Build().runAsync();