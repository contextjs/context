/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File, Path } from "@contextjs/io";
import { RouteDefinition } from "@contextjs/routing";
import { StringExtensions } from "@contextjs/system";
import path from "path";
import "reflect-metadata";
import typescript from "typescript";
import { pathToFileURL } from "url";
import { clearRegisteredRoutes, getControllerMetadata, getRegisteredControllers } from "../decorators/controller.decorator.js";
import { ControllerDefinition } from "../models/controller-definition.js";
import { VerbRouteDiscoveryService } from "./verb-route-discovery-service.js";

export class ControllerDiscoveryService {
    public static async discoverAsync(): Promise<{ controllers: ControllerDefinition[], routes: RouteDefinition[] }> {
        const entryFile = Path.normalize(process.env['CTX_ENTRY_FILE'] || process.argv[1]);
        const entryDir = path.dirname(entryFile);
        const outDir = this.getProjectOutputDirectory(entryDir);

        const files = Directory
            .listFiles(outDir, true)
            .filter(fileName => {
                const ext = File.getExtension(fileName);
                return (ext === "js" || ext === "mjs" || ext === "cjs") && Path.normalize(fileName) !== entryFile;
            });

        for (const file of files) {
            const importPath = pathToFileURL(Path.normalize(file)).href;
            try {
                await import(importPath);
            }
            catch (error) {
                console.error(`Failed to import ${importPath}:`, error);
            }
        }

        const controllerDefinitions: ControllerDefinition[] = [];
        const routeDefinitions: RouteDefinition[] = [];

        for (const exportedClass of getRegisteredControllers()) {
            const exportName = exportedClass.name;
            const controllerMeta = getControllerMetadata(exportedClass);
            if (!controllerMeta)
                continue;

            const definition = new ControllerDefinition(exportName, exportedClass, Reflect.getMetadata("controller:template", exportedClass));
            controllerDefinitions.push(definition);

            const routes = await VerbRouteDiscoveryService.discoverAsync(exportedClass, definition);
            routeDefinitions.push(...routes);
        }

        clearRegisteredRoutes();

        return { controllers: controllerDefinitions, routes: routeDefinitions };
    }

    private static getProjectOutputDirectory(baseDir: string): string {
        const tsConfigFilePath = typescript.findConfigFile(baseDir, typescript.sys.fileExists, "tsconfig.json");
        if (StringExtensions.isNullOrWhitespace(tsConfigFilePath))
            throw new Error("Could not find tsconfig.json");

        const configFile = typescript.readConfigFile(tsConfigFilePath, typescript.sys.readFile);
        if (configFile.error)
            throw new Error("Error reading tsconfig.json");

        const configDir = path.dirname(tsConfigFilePath);
        const parsedConfig = typescript.parseJsonConfigFileContent(configFile.config, typescript.sys, configDir);
        const outDir = parsedConfig.options.outDir;

        if (!StringExtensions.isNullOrWhitespace(outDir))
            return path.isAbsolute(outDir) ? Path.normalize(outDir) : Path.normalize(path.join(configDir, outDir));

        return configDir;
    }
}