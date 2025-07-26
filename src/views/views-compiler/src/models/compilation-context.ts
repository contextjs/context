/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class CompilationContext {
    projectRoot: string;
    files: string[];
    project: Record<string, any>;
    getFileContentAsync: (filePath: string) => Promise<string>;
    generateSourceMap: boolean = true;

    public constructor(
        projectRoot: string,
        files: string[] = [],
        project: Record<string, any>,
        getFileContentAsync: (filePath: string) => Promise<string>,
        generateSourceMap: boolean = true) {
        this.projectRoot = projectRoot;
        this.files = files;
        this.project = project;
        this.getFileContentAsync = getFileContentAsync;
        this.generateSourceMap = generateSourceMap;
    }
}