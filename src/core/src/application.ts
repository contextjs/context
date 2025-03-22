/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Environment } from "./models/environment.js";

export class Application {
    private readonly events: (() => Promise<any>)[] = [];
    public readonly environment: Environment = new Environment();

    public async runAsync(): Promise<void> {
        for (let i = 0; i < this.events.length; i++)
            await this.events[i]();
    }

    public onRun(execute: () => Promise<any>): Application {
        this.events.push(execute);
        return this;
    }
}