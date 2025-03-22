/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleService } from "../services/console.service.js";
import { EnvironmentName } from "./environment-name.js";

export class Environment {
    public name: string = EnvironmentName.development;

    public get isDevelopment(): boolean {
        return this.name.toLowerCase() === EnvironmentName.development;
    }

    public get isProduction(): boolean {
        return this.name.toLowerCase() === EnvironmentName.production;
    }

    public get isTest(): boolean {
        return this.name.toLowerCase() === EnvironmentName.test;
    }

    public get isStaging(): boolean {
        return this.name.toLowerCase() === EnvironmentName.staging;
    }

    public constructor() {
        this.getCLIEnvironment();
    }

    private getCLIEnvironment() {
        const args = ConsoleService.parseArguments(process.argv.slice(2));
        const environmentArgument = args.find(a => a.name === 'environment');

        if (environmentArgument && environmentArgument.values.length > 0)
            this.name = environmentArgument.values[0];
    }
}