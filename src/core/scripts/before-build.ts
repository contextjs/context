/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import Config from '../../../scripts/config.ts';
import Script from '../../../scripts/script.ts';

export class BeforeBuild extends Script {
    public override async runAsync(): Promise<void> {
        await this.publishApiAsync();
        await this.setVersionAsync();
    }

    private async publishApiAsync() {
        await this.createDirectoryAsync(`${Config.buildFolder}/core/api`);
        await this.copyFileAsync('src/core/src/api/index.d.ts', `${Config.buildFolder}/core/api/index.d.ts`);
    }

    private async setVersionAsync() {

        const file = (await this.readFileAsync('src/core/src/services/version.service.ts'))
            .replace(/private static version = ".*";/, `private static version = "${Config.version}";`);

        await this.writeFileAsync('src/core/src/services/version.service.ts', file);
    }
}

await new BeforeBuild().runAsync();