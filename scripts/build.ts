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

import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import Config from "./config.ts";
import type PackageInfo from './package-info.ts';
import Script from "./script.ts";

export class Build extends Script {
    public override async runAsync(): Promise<void> {
        await this.npmInstallAsync();
        await this.createOutputDirectoriesAsync();

        const packagesInfo = await this.getPackagesInfoAsync();
        if (packagesInfo.length === 0) {
            this.writeLogAsync('No packages to build.');
            return;
        }

        await this.writeLogAsync('\r');

        await this.executeActionAsync(packagesInfo, this.buildPackageAsync.bind(this));
        await this.executeActionAsync(packagesInfo, this.afterBuildAsync.bind(this));
    }

    private async npmInstallAsync(): Promise<void> {
        if (!(await this.pathExistsAsync('node_modules'))) {
            this.writeLogAsync('Installing npm packages…');

            const packageJsonPath = path.resolve(process.cwd(), 'package.json');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            const parsedPackage = JSON.parse(packageJsonContent);
            if (parsedPackage.dependencies) {
                for (const name of Object.keys(parsedPackage.dependencies)) {
                    if (name.startsWith('@contextjs'))
                        delete parsedPackage.dependencies[name];
                }
                await fs.writeFile(packageJsonPath, JSON.stringify(parsedPackage, null, 2) + '\n');
            }

            await this.executeCommandAsync('npm update');
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
        const packageFilePath = `src/${packageInfo.path}/package.json`;

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
        const path = `${packageInfo.path}`;

        if (await this.pathExistsAsync(`src/${path}/scripts/build.ts`)) {
            const buildClassImport = await import(`../src/${path}/scripts/build.ts`);
            await new buildClassImport.Build().runAsync(packageInfo);
        }
    }

    private async createPackageAsync(packageInfo: PackageInfo): Promise<void> {
        if (packageInfo.disableNPM === true)
            return;

        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageInfo.name} && npm pack --silent --pack-destination ../../${Config.packagesFolder}`, true);
    }

    private async installPackageAsync(packageInfo: PackageInfo): Promise<void> {
        if (packageInfo.disableNPM === true)
            return;

        const packageJsonFile = await this.readFileAsync(`${Config.buildFolder}/${packageInfo.name}/package.json`);
        const packageJson = JSON.parse(packageJsonFile);
        const name = packageJson.name.replace("@", "").replace("/", "-");

        await this.executeCommandAsync(`npm install ./${Config.packagesFolder}/${name}-${Config.version}.tgz`, true);
    }
}

const builer = new Build();
await builer.runAsync();