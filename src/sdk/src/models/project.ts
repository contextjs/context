/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DirectoryPathOperation, File, FilePathOperation } from "@contextjs/io";
import { NullReferenceException } from "@contextjs/system";

export class Project {
    public readonly name: string;
    public readonly target: string;
    public readonly main: string;
    public readonly fileOperations: FilePathOperation[];
    public readonly directoryOperations: DirectoryPathOperation[] = [];
    public readonly compilerExtensions: string[];

    public constructor(
        name: string,
        target: string,
        main: string,
        fileOperations: FilePathOperation[] = [],
        directoryOperations: DirectoryPathOperation[] = [],
        compilerExtensions: string[] = []) {
        this.name = name;
        this.target = target;
        this.main = main;
        this.fileOperations = fileOperations;
        this.compilerExtensions = compilerExtensions;
        this.directoryOperations = directoryOperations;
    }

    public validate(): void {
        NullReferenceException.throwIfNullOrWhitespace(this.name);
        NullReferenceException.throwIfNullOrWhitespace(this.target);
        NullReferenceException.throwIfNullOrWhitespace(this.main);

        for (const file of this.fileOperations) {
            NullReferenceException.throwIfNullOrWhitespace(file.source);
            NullReferenceException.throwIfNullOrWhitespace(file.destination);
        }

        for (const dir of this.directoryOperations) {
            NullReferenceException.throwIfNullOrWhitespace(dir.source);
            NullReferenceException.throwIfNullOrWhitespace(dir.destination);
        }
    }

    public static fromJson(json: string): Project {
        const data = JSON.parse(json);
        const fileOperations = (data.fileOperations ?? []).map((t: any) => new FilePathOperation(t.source, t.destination, t.type));
        const directoryOperations = (data.directoryOperations ?? []).map((t: any) => new DirectoryPathOperation(t.source, t.destination, t.type));

        return new Project(
            data.name,
            data.target,
            data.main,
            fileOperations,
            directoryOperations,
            data.compilerExtensions ?? []
        );
    }

    public static async fromFileAsync(filePath: string): Promise<Project> {
        return Project.fromJson(await File.readAsync(filePath));
    }
}