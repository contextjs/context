/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import Config from '../../../scripts/config.ts';
import Script from '../../../scripts/script.ts';

export class AfterBuild extends Script {
    private statement = '#!/usr/bin/env node';

    public override async runAsync(): Promise<void> {
        await this.prependExecutableStatement();
    }

    private async prependExecutableStatement() {
        const filePath = `${Config.buildFolder}/context/context.js`;
        let file = await this.readFileAsync(filePath);
        file = `${this.statement}\n\n${file}`;
        await this.writeFileAsync(filePath, file);
    }
}

await new AfterBuild().runAsync();