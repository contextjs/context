/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File, Path } from "@contextjs/io";
import { StringExtensions } from "@contextjs/system";
import path from "path";
import { cwd } from "process";
import "reflect-metadata";
import typescript from "typescript";
import { pathToFileURL } from "url";
import { clearRegisteredRoutes, getRegisteredRoutes } from "../decorators/route.decorator.js";
import { RouteDefinition } from "../models/route-definition.js";
import { RouteInfo } from "../models/route-info.js";

export class RouteDiscoveryService {
    public static async discoverRoutesAsync(): Promise<RouteDefinition[]> {
        const currentDirectory = path.join(cwd(), this.getCurrentDirectory());
        const entryFile = Path.normalize(process.env['CTX_ENTRY_FILE'] || process.argv[1]);
        const files = Directory
            .listFiles(currentDirectory, true)
            .filter(f => File.getExtension(f) === "js" || File.getExtension(f) === "mjs")
            .filter(f => Path.normalize(f) !== entryFile);

        for (const file of files) {
            const importPath = pathToFileURL(Path.normalize(file)).href;
            try {
                await import(importPath);
            }
            catch (error) {
                console.error(`Failed to import ${importPath}:`, error);
                continue;
            }
        }

        const routeDefinitions: RouteDefinition[] = [];
        for (const reg of getRegisteredRoutes()) {
            const { target, propertyKey, template, name } = reg;
            const controllerName = (target as any).constructor?.name || (target as any).name || "UnknownController";
            const routeInfo = new RouteInfo(template, name);
            routeDefinitions.push(new RouteDefinition(controllerName, propertyKey.toString(), routeInfo));
        }

        clearRegisteredRoutes();

        return routeDefinitions;
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