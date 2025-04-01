/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Script from '../../../scripts/script.ts';

export class BeforeBuild extends Script {
    private readonly packageName: string = "configuration-json";

    public override async runAsync(): Promise<void> {
        await this.copyDeclarationsFileAsync(this.packageName);
        await this.copyReadmeFileAsync(this.packageName);
    }
}

await new BeforeBuild().runAsync();