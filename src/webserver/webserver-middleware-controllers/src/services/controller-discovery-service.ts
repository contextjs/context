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
import { cwd } from "process";
import "reflect-metadata";
import typescript from "typescript";
import { pathToFileURL } from "url";
import { getControllerMetadata } from "../decorators/controller.decorator.js";
import { ControllerDefinition } from "../models/controller-definition.js";
import { VerbRouteDiscoveryService } from "./verb-route-discovery-service.js";

export class ControllerDiscoveryService {
    public static async discoverAsync(): Promise<{ controllers: ControllerDefinition[], routes: RouteDefinition[] }> {
        const currentDirectory = path.join(cwd(), this.getCurrentDirectory());
        const entryFile = Path.normalize(process.argv[1]);
        const files = Directory
            .listFiles(currentDirectory, true)
            .filter(fileName => {
                const ext = File.getExtension(fileName);
                return ext === "js" || ext === "mjs" || ext === "cjs";
            })
            .filter(fileName => Path.normalize(fileName) !== entryFile);

        const controllerDefinitions: ControllerDefinition[] = [];
        const routeDefinitions: RouteDefinition[] = [];

        for (const file of files) {
            const importPath = pathToFileURL(Path.normalize(file)).href;

            let importedFile;
            try {
                importedFile = await import(importPath);
            }
            catch (error) {
                console.error(`Failed to import ${importPath}:`, error);
                continue;
            }

            for (const exportName of Object.keys(importedFile)) {
                const exportedClass = importedFile[exportName];
                if (typeof exportedClass !== "function")
                    continue;

                const controllerMeta = getControllerMetadata(exportedClass);
                if (!controllerMeta)
                    continue;

                const definition = new ControllerDefinition(exportName, exportedClass, Reflect.getMetadata("controller:template", exportedClass));

                controllerDefinitions.push(definition);
                routeDefinitions.push(...await VerbRouteDiscoveryService.discoverAsync(importedFile, importPath, definition));
            }
        }

        return { controllers: controllerDefinitions, routes: routeDefinitions }
    }

    private static getCurrentDirectory(): string {
        const tsConfigFilePath = typescript.findConfigFile("./", typescript.sys.fileExists, "tsconfig.json");

        if (StringExtensions.isNullOrWhiteSpace(tsConfigFilePath))
            throw new Error("Could not find tsconfig.json");

        const configFile = typescript.readConfigFile(tsConfigFilePath, typescript.sys.readFile);
        if (configFile.error)
            throw new Error("Error reading tsconfig.json");

        const parsedConfig = typescript.parseJsonConfigFileContent(configFile.config, typescript.sys, "./");
        const outDir = parsedConfig.options.outDir;

        if (!StringExtensions.isNullOrWhiteSpace(outDir))
            return Path.normalize(outDir);

        return Path.normalize(".");
    }
}