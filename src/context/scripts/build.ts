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
    private readonly packageInfo: PackageInfo = { name: "context" };
    private statement = '#!/usr/bin/env node';

    public override async runAsync(): Promise<void> {
        await this.copyReadmeFileAsync(this.packageInfo);
        await this.executeCommandAsync(`cd src/${this.packageInfo.name} && tsc`);
        await this.addExecutableStatement();
    }

    private async addExecutableStatement() {
        const filePath = `${Config.buildFolder}/${this.packageInfo.name}/context.js`;
        let file = await this.readFileAsync(filePath);
        file = `${this.statement}\n\n${file}`;
        await this.writeFileAsync(filePath, file);
    }
}

await new Build().runAsync();