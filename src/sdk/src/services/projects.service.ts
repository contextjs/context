/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from "node:path";

import { Dictionary } from "@contextjs/collections";
import { File, Path } from "@contextjs/io";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { Project } from "../models/project.js";

export class ProjectsService {
    private readonly projectCache = new Dictionary<string, Project | null>();

    public clearCache(): void {
        this.projectCache.clear();
    }

    public invalidateProject(filePath: string): void {
        this.projectCache.delete(Path.resolve(File.getDirectory(filePath) ?? StringExtensions.empty));
    }

    public async hasProjectAsync(filePath: string): Promise<boolean> {
        return !ObjectExtensions.isNull(await this.findProjectAsync(filePath));
    }

    public async findProjectAsync(filePath: string): Promise<Project | null> {
        let currentDirectory = path.dirname(filePath);

        while (true) {
            const cacheKey = path.resolve(currentDirectory);

            if (this.projectCache.has(cacheKey))
                return this.projectCache.get(cacheKey)!;

            const projectPath = path.join(currentDirectory, "context.ctxp");

            if (await File.existsAsync(projectPath)) {
                try {
                    const project = await Project.fromFileAsync(projectPath);
                    this.projectCache.set(cacheKey, project);

                    return project;
                }
                catch (error) {
                    this.invalidateProject(filePath);
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