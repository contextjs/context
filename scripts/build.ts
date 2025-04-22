/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 *
 * 
 * This script builds ContextJS.
 * 
 * @example
 * npm run build - builds all projects.
 * npm run build project1 project2 ... - builds specified projects.
 */

import readline from 'node:readline';
import Config from "./config.ts";
import type PackageInfo from './package-info.ts';
import Script from "./script.ts";

export class Build extends Script {
    public override async runAsync(): Promise<void> {
        await this.npmInstallAsync();
        await this.createOutputDirectoriesAsync();

        const packageDescriptors = await this.getPackageDescriptorsAsync();

        if (packageDescriptors.size === 0) {
            this.writeLogAsync('No packages to build.');
            return;
        }

        await this.writeLogAsync('\r');

        await this.executeActionAsync(packageDescriptors, this.buildPackageAsync.bind(this));
        await this.executeActionAsync(packageDescriptors, this.afterBuildAsync.bind(this));
    }

    private async npmInstallAsync(): Promise<void> {
        if (await this.pathExistsAsync('node_modules') === false) {
            this.writeLogAsync('Installing npm packages...');
            this.executeCommandAsync('npm pkg delete dependencies && npm update');
        }
    }

    private async createOutputDirectoriesAsync(): Promise<void> {
        await this.createDirectoryAsync(Config.buildFolder);
        await this.createDirectoryAsync(Config.packagesFolder);
    }

    private async buildPackageAsync(packageInfo: PackageInfo): Promise<void> {
        await this.writeLogAsync(`Building "@contextjs/${packageInfo.name}"...`);

        await this.removeDependencyAsync(packageInfo);
        await this.createPackageDirectoryAsync(packageInfo);
        await this.copyPackageFileAsync(packageInfo);
        await this.copyLicenseFileAsync(packageInfo);
        await this.writeVersionAsync(packageInfo);
        await this.buildAsync(packageInfo);
        await this.createPackageAsync(packageInfo);
        await this.installPackageAsync(packageInfo);

        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 1);
        await this.writeLogAsync(`Building "@contextjs/${packageInfo.name}"... Done.\r`);
    }

    private async afterBuildAsync(packageInfo: PackageInfo): Promise<void> {
        const packagePath = packageInfo.path
            ? `${packageInfo.path}/${packageInfo.name}`
            : packageInfo.name;

        if (await this.pathExistsAsync(`src/${packagePath}/scripts/after-build.ts`))
            await import(`../src/${packagePath}/scripts/after-build.ts`);
    }

    private async removeDependencyAsync(packageInfo: PackageInfo): Promise<void> {
        await this.executeCommandAsync(`npm pkg delete dependencies.@contextjs/${packageInfo.name}`);
    }

    private async createPackageDirectoryAsync(packageInfo: PackageInfo): Promise<void> {
        const directoryName = `${Config.buildFolder}/${packageInfo.name}`;

        await this.removeDirectoryAsync(directoryName);
        await this.createDirectoryAsync(directoryName);
    }

    private async copyPackageFileAsync(packageInfo: PackageInfo): Promise<void> {
        const packageFilePath = packageInfo.path
            ? `src/${packageInfo.path}/${packageInfo.name}/package.json`
            : `src/${packageInfo.name}/package.json`;

        if (await this.pathExistsAsync(packageFilePath) === false)
            throw new Error(`Missing package.json in "${packageFilePath}" package.`);

        await this.copyFileAsync(packageFilePath, `${Config.buildFolder}/${packageInfo.name}/package.json`);
    }

    private async copyLicenseFileAsync(packageInfo: PackageInfo): Promise<void> {
        await this.copyFileAsync('LICENSE', `${Config.buildFolder}/${packageInfo.name}/LICENSE`);
    }

    private async writeVersionAsync(packageInfo: PackageInfo): Promise<void> {
        const packageFilePath = `${Config.buildFolder}/${packageInfo.name}/package.json`;
        let packageFileContent = await this.readFileAsync(packageFilePath);
        packageFileContent = packageFileContent.replace(/__VERSION__/g, Config.version);
        await this.writeFileAsync(packageFilePath, packageFileContent);
    }

    private async buildAsync(packageInfo: PackageInfo): Promise<void> {
        const path = packageInfo.path
            ? `${packageInfo.path}/${packageInfo.name}`
            : packageInfo.name;

        if (await this.pathExistsAsync(`src/${path}/scripts/build.ts`))
            await import(`../src/${path}/scripts/build.ts`);
    }

    private async createPackageAsync(packageInfo: PackageInfo): Promise<void> {
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageInfo.name} && npm pack --silent --pack-destination ../../${Config.packagesFolder}`, true);
    }

    private async installPackageAsync(packageInfo: PackageInfo): Promise<void> {
        const packageJsonFile = await this.readFileAsync(`${Config.buildFolder}/${packageInfo.name}/package.json`);
        const packageJson = JSON.parse(packageJsonFile);
        const name = packageJson.name.replace("@", "").replace("/", "-");

        await this.executeCommandAsync(`npm install ./${Config.packagesFolder}/${name}-${Config.version}.tgz`, true);
    }

    private async executeActionAsync(packageDescriptors: Map<string, string[]>, action: Function): Promise<void> {
        for (const packageDescriptor of packageDescriptors) {
            if (packageDescriptor[1].length === 0)
                await action({ name: packageDescriptor[0] });
            else
                for (const packagePath of packageDescriptor[1])
                    await action({ name: packagePath, path: packageDescriptor[0] });
        }
    }
}

const builer = new Build();
await builer.runAsync();