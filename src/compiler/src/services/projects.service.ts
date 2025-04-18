/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory } from "@contextjs/io";
import path from "node:path";
import typescript from "typescript";
import { IParsedProjectConfig } from "../interfaces/i-parsed-project-config.js";

export class ProjectsService {
    public static getSourceFiles(projectPath: string): string[] {
        const srcPath = path.join(projectPath, "src");
        return Directory.listFiles(srcPath, true).filter(file => file.endsWith(".ts"));
    }

    public static getParsedConfig(projectPath: string): IParsedProjectConfig {
        const tsconfigPath = path.join(projectPath, "tsconfig.json");
        const result = typescript.readConfigFile(tsconfigPath, typescript.sys.readFile);

        if (result.error)
            throw new Error(typescript.flattenDiagnosticMessageText(result.error.messageText, "\n"));

        const config = typescript.parseJsonConfigFileContent(result.config, typescript.sys, projectPath);
        return { configPath: tsconfigPath, config };
    }
}