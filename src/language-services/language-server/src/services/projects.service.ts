/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import path from "path";
import { fileURLToPath } from "url";
import { ServerContext } from "../models/server-context.js";

export class ProjectsService {
    private readonly context: ServerContext;
    private readonly projectCache = new Map<string, Record<string, any> | null>();

    public constructor(context: ServerContext) {
        this.context = context;
    }

    public hasProject(fileUri: string): boolean {
        return this.findProject(fileUri) !== null;
    }

    public invalidateProject(fileUri: string): void {
        this.projectCache.delete(path.dirname(fileURLToPath(fileUri)));
    }

    public clearCache(): void {
        this.projectCache.clear();
    }

    public findProject(fileUri: string): Record<string, any> | null {
        const filePath = fileURLToPath(fileUri);
        let currentDirectory = path.dirname(filePath);

        while (true) {
            const cacheKey = path.resolve(currentDirectory);

            if (this.projectCache.has(cacheKey))
                return this.projectCache.get(cacheKey)!;

            const projectPath = path.join(currentDirectory, "context.ctxp");

            if (File.exists(projectPath)) {
                try {
                    const project = JSON.parse(File.read(projectPath));
                    this.projectCache.set(cacheKey, project);
                    return project;
                }
                catch (error) {
                    console.error(`Failed to parse context.ctxp at ${projectPath}: ${error}`);
                    this.invalidateProject(fileUri);
                    return null;
                }
            }

            const parent = path.dirname(currentDirectory);
            if (parent === currentDirectory)
                break;

            currentDirectory = parent;
        }

        return null;
    }
}