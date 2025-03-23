/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Config from '../../../scripts/config.ts';
import Script from '../../../scripts/script.ts';

export class BeforeBuild extends Script {
    public override async runAsync(): Promise<void> {
        await this.publishApiAsync();
    }

    private async publishApiAsync() {
        await this.createDirectoryAsync(`${Config.buildFolder}/io/api`);
        await this.copyFileAsync('src/io/src/api/index.d.ts', `${Config.buildFolder}/io/api/index.d.ts`);
    }
}

await new BeforeBuild().runAsync();