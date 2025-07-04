/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { execSync } from "child_process";
import fs from "fs";
import Config from "./config.ts";
import type PackageInfo from "./package-info.ts";

export default abstract class Script {
    abstract runAsync(packageInfo: PackageInfo): Promise<void>;

    protected async executeCommandAsync(command: string, silent: boolean = false): Promise<void> {
        execSync(command, { stdio: silent ? 'ignore' : 'inherit' });
    }

    protected async writeLogAsync(message: string): Promise<void> {
        console.log(message);
    }

    protected async getPackagesInfoAsync(): Promise<PackageInfo[]> {
        const packageNames = process.argv.slice(2);
        if (packageNames.length > 0) {
            const packagesInfo: PackageInfo[] = [];
            for (const packageName of packageNames) {
                const packageInfo = Config.packagesInfo.find(p => p.name === packageName);
                if (packageInfo)
                    packagesInfo.push(packageInfo);
                else
                    throw new Error(`Package ${packageName} not found in configuration.`);
            }

            return packagesInfo;
        }

        return Config.packagesInfo;
    }

    protected async createDirectoryAsync(directoryName: string): Promise<void> {
        if (!fs.existsSync(directoryName))
            fs.mkdirSync(directoryName, { recursive: true });
    }

    protected async removeDirectoryAsync(directoryName: string): Promise<void> {
        if (fs.existsSync(directoryName))
            fs.rmSync(directoryName, { recursive: true });
    }

    protected async pathExistsAsync(path: string): Promise<boolean> {
        return fs.existsSync(path);
    }

    protected async copyFileAsync(source: string, destination: string): Promise<void> {
        fs.copyFileSync(source, destination);
    }

    protected async readFileAsync(filePath: string): Promise<string> {
        return fs.readFileSync(filePath, 'utf8')?.toString();
    }

    protected async writeFileAsync(filePath: string, content: string): Promise<void> {
        fs.writeFileSync(filePath, content);
    }

    protected async copyDeclarationsFileAsync(packageInfo: PackageInfo): Promise<void> {
        await this.createDirectoryAsync(`${Config.buildFolder}/${packageInfo.name}/api`);
        await this.copyFileAsync(`src/${packageInfo.path}/src/api/index.d.ts`, `${Config.buildFolder}/${packageInfo.name}/api/index.d.ts`);
    }

    protected async copyReadmeFileAsync(packageInfo: PackageInfo): Promise<void> {
        await this.copyFileAsync(`src/${packageInfo.path}/README.md`, `${Config.buildFolder}/${packageInfo.name}/README.md`);
    }

    protected async copyProviderManifestFile(packageInfo: PackageInfo) {
        await this.copyFileAsync(`src/${packageInfo.path}/contextjs.provider.json`, `${Config.buildFolder}/${packageInfo.name}/contextjs.provider.json`);
    }

    protected async executeActionAsync(packagesInfo: PackageInfo[], action: Function): Promise<void> {
        for (const packageInfo of packagesInfo) {
            await action(packageInfo);
        }
    }
}