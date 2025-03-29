/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Environment } from "./models/environment.js";

export class Application {
    private readonly functions: (() => Promise<any>)[] = [];
    public readonly environment: Environment = new Environment();

    public async runAsync(): Promise<Application> {
        await Promise.all(this.functions.map(f => f()));
        return this;
    }

    public onRun(event: () => Promise<any>): Application {
        this.functions.push(event);
        return this;
    }
}