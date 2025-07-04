/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { execSync } from "child_process";
import path from "path";

import { Dictionary } from "@contextjs/collections";
import { Directory, File, Path } from "@contextjs/io";
import { Console } from "@contextjs/system";
import { ICommandManifest } from "../interfaces/i-command-manifest.js";
import { IProviderManifest } from "../interfaces/i-provider-manifest.js";
import { IProviderWithRootManifest } from "../interfaces/i-provider-with-root-manifest.js";
import { ITemplateManifest } from "../interfaces/i-template-manifest.js";


export class ProviderDiscoveryService {
    public static discover(includeGlobals: boolean = true): IProviderWithRootManifest[] {
        const localPackages = this.discoverPackages(Path.join(process.cwd(), "node_modules"), true);
        const globalPackages: IProviderWithRootManifest[] = [];

        if (includeGlobals) {
            try {
                const globalPackagesPath = execSync("npm root -g").toString().trim();
                globalPackages.push(...this.discoverPackages(globalPackagesPath, false));
            }
            catch {
                Console.writeLineWarning("Could not discover global node modules. Continuing with local only.");
            }
        }

        const providers = new Dictionary<string, IProviderWithRootManifest>();

        for (const provider of [...globalPackages, ...localPackages])
            providers.set(provider.name, provider);

        return providers.values();
    }

    private static discoverPackages(nodeModulesPath: string, isLocal: boolean): IProviderWithRootManifest[] {
        if (!Directory.exists(nodeModulesPath))
            return [];

        const providers: IProviderWithRootManifest[] = [];
        const packageDirectories = Path.listDirectories(nodeModulesPath);

        for (const packageDirectory of packageDirectories) {
            if (packageDirectory.startsWith('@')) {
                const scopedDirectories = Path.listDirectories(Path.join(nodeModulesPath, packageDirectory));
                for (const directory of scopedDirectories) {
                    const root = Path.join(nodeModulesPath, packageDirectory, directory);
                    const manifestPath = Path.join(root, "contextjs.provider.json");
                    this.tryAddProvider(providers, manifestPath, root, isLocal);
                }
            }
            else {
                const root = Path.join(nodeModulesPath, packageDirectory);
                const manifestPath = Path.join(root, "contextjs.provider.json");
                this.tryAddProvider(providers, manifestPath, root, isLocal);
            }
        }

        return providers;
    }

    private static tryAddProvider(providers: IProviderWithRootManifest[], manifestPath: string, root: string, isLocal: boolean): void {
        if (!File.exists(manifestPath))
            return;

        try {
            const content = File.read(manifestPath);
            const manifestObj = JSON.parse(content) as any;
            const hydrated = this.hydrateProviderManifest(manifestObj, isLocal, root);
            providers.push({ ...hydrated, root });
        }
        catch (error: any) {
            Console.writeLineWarning(`Invalid provider manifest at ${manifestPath}: ${error.message}`);
        }
    }

    private static hydrateProviderManifest(raw: any, isLocal: boolean, root: string): IProviderManifest {
        return {
            name: raw.name,
            commands: this.toDictionary<ICommandManifest>(raw.commands),
            templates: this.hydrateTemplates(raw.templates),
            compilerExtensions: isLocal && raw.compilerExtensions
                ? raw.compilerExtensions.map((ext: string) => path.isAbsolute(ext) ? ext : path.resolve(root, ext))
                : []
        };
    }

    private static hydrateTemplates(obj: any): Dictionary<string, ITemplateManifest> {
        const result = new Dictionary<string, ITemplateManifest>();
        if (!obj)
            return result;

        for (const key of Object.keys(obj))
            result.set(key, { ...obj[key], commands: this.toDictionary<ICommandManifest>(obj[key].commands) });

        return result;
    }

    private static toDictionary<T>(obj: any): Dictionary<string, T> {
        const result = new Dictionary<string, T>();

        if (!obj)
            return result;
        for (const key of Object.keys(obj))
            result.set(key, obj[key]);

        return result;
    }
}