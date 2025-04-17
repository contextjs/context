/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "../services/console.js";
import { EnvironmentName } from "./environment-name.js";

export class Environment {
    private _name: string;

    public constructor(args: string[] = process.argv.slice(2)) {
        this._name = this.extractEnvironmentName(args);
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value.toLowerCase();
    }

    public get isDevelopment(): boolean {
        return this._name === EnvironmentName.development;
    }

    public get isProduction(): boolean {
        return this._name === EnvironmentName.production;
    }

    public get isTest(): boolean {
        return this._name === EnvironmentName.test;
    }

    public get isStaging(): boolean {
        return this._name === EnvironmentName.staging;
    }

    public toString(): string {
        return this._name;
    }

    private extractEnvironmentName(args: string[]): string {
        const parsed = Console.parseArguments(args);
        const envArg = parsed.find(t => t.name === '--environment' || t.name === '-e');
        const env = envArg?.values?.[0]?.toLowerCase();
        return env || EnvironmentName.development;
    }
}