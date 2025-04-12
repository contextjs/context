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

import Config from "./config.ts";
import Script from "./script.ts";

export class Build extends Script {
    public override async runAsync(): Promise<void> {
        await this.npmInstallAsync();
        await this.createOutputDirectoriesAsync();

        const packageNames = await this.getPackageNamesAsync();

        for (const packageName of packageNames)
            await this.buildPackageAsync(packageName);

        await this.writeLogAsync('\nCreating packages...');
        for (const packageName of packageNames)
            await this.createAndInstallPackageAsync(packageName);
        
        await this.writeLogAsync('Done');
    }

    private async npmInstallAsync(): Promise<void> {
        if (await this.pathExistsAsync('node_modules') === false) {
            this.writeLogAsync('Installing npm packages...');
            this.executeCommandAsync('npm pkg delete dependencies && npm update');
        }
    }

    private async createAndInstallPackageAsync(packageName: string): Promise<void> {
        await this.createPackageAsync(packageName);
        await this.installPackageAsync(packageName);
    }

    private async createOutputDirectoriesAsync(): Promise<void> {
        await this.createDirectoryAsync(Config.buildFolder);
        await this.createDirectoryAsync(Config.packagesFolder);
    }

    private async buildPackageAsync(packageName: string): Promise<void> {
        await this.writeLogAsync(`Building "@contextjs/${packageName}"...`);

        await this.removeDependencyAsync(packageName);
        await this.createPackageDirectoryAsync(packageName);
        await this.copyPackageFileAsync(packageName);
        await this.copyLicenseFileAsync(packageName);
        await this.writeVersionAsync(packageName);
        await this.buildAsync(packageName);

        await this.writeLogAsync(`Building "@contextjs/${packageName}"... Done.`, true);
    }

    private async removeDependencyAsync(packageName: string): Promise<void> {
        await this.executeCommandAsync(`npm pkg delete dependencies.@contextjs/${packageName}`);
    }

    private async createPackageDirectoryAsync(packageName: string): Promise<void> {
        const directoryName = `${Config.buildFolder}/${packageName}`;

        await this.removeDirectoryAsync(directoryName);
        await this.createDirectoryAsync(directoryName);
    }

    private async copyPackageFileAsync(packageName: string): Promise<void> {
        const packageFilePath = `src/${packageName}/package.json`;
        if (await this.pathExistsAsync(packageFilePath) === false)
            throw new Error(`Missing package.json in "${packageName}" package.`);

        await this.copyFileAsync(packageFilePath, `${Config.buildFolder}/${packageName}/package.json`);
    }

    private async copyLicenseFileAsync(packageName: string): Promise<void> {
        await this.copyFileAsync('LICENSE', `${Config.buildFolder}/${packageName}/LICENSE`);
    }

    private async writeVersionAsync(packageName: string): Promise<void> {
        const packageFilePath = `${Config.buildFolder}/${packageName}/package.json`;
        let packageFileContent = await this.readFileAsync(packageFilePath);
        packageFileContent = packageFileContent.replace(/__VERSION__/g, Config.version);
        await this.writeFileAsync(packageFilePath, packageFileContent);
    }

    private async buildAsync(packageName: string): Promise<void> {
        if (await this.pathExistsAsync(`src/${packageName}/scripts/build.ts`))
            await import(`../src/${packageName}/scripts/build.ts`);
    }

    private async createPackageAsync(packageName: string): Promise<void> {
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageName} && npm pack --silent --pack-destination ../../${Config.packagesFolder}`);
    }

    private async installPackageAsync(packageName: string): Promise<void> {
        const packageJsonFile = await this.readFileAsync(`${Config.buildFolder}/${packageName}/package.json`);
        const packageJson = JSON.parse(packageJsonFile);
        const name = packageJson.name.replace("@", "").replace("/", "-");

        await this.executeCommandAsync(`npm install ./${Config.packagesFolder}/${name}-${Config.version}.tgz --silent`);
    }
}

const builer = new Build();
await builer.runAsync();