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
    abstract runAsync(): Promise<void>;

    protected async executeCommandAsync(command: string, silent: boolean = false): Promise<void> {
        execSync(command, { stdio: silent ? 'ignore' : 'inherit' });
    }

    protected async writeLogAsync(message: string): Promise<void> {
        console.log(message);
    }

    protected async getPackageDescriptorsAsync(): Promise<Map<string, string[]>> {
        const packageNames = process.argv.slice(2);

        if (packageNames.length > 0) {
            const packageDescriptors = new Map<string, string[]>([]);
            for (const packageName of packageNames) {
                if (Config.packageDescriptors.has(packageName))
                    packageDescriptors.set(packageName, Config.packageDescriptors.get(packageName) ?? []);
                else
                    throw new Error(`Package ${packageName} not found in configuration.`);
            }

            return packageDescriptors;
        }

        return Config.packageDescriptors;
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
        const packagePath = packageInfo.path
            ? `${packageInfo.path}/${packageInfo.name}`
            : packageInfo.name;

        await this.createDirectoryAsync(`${Config.buildFolder}/${packageInfo.name}/api`);
        await this.copyFileAsync(`src/${packagePath}/src/api/index.d.ts`, `${Config.buildFolder}/${packageInfo.name}/api/index.d.ts`);
    }

    protected async copyReadmeFileAsync(packageInfo: PackageInfo): Promise<void> {
        const packagePath = packageInfo.path
            ? `${packageInfo.path}/${packageInfo.name}`
            : packageInfo.name;

        await this.copyFileAsync(`src/${packagePath}/README.md`, `${Config.buildFolder}/${packageInfo.name}/README.md`);
    }

    protected async executeActionAsync(packageDescriptors: Map<string, string[]>, action: Function): Promise<void> {
        for (const packageDescriptor of packageDescriptors) {
            if (packageDescriptor[1].length === 0)
                await action({ name: packageDescriptor[0] });
            else
                for (const packagePath of packageDescriptor[1])
                    await action({ name: packagePath, path: packageDescriptor[0] });
        }
    }
}