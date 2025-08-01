/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/*
 * Represents a project.
 */
export declare class Project {
    /**
     * The name of the project.
     */
    public readonly name: string;

    /**
     * The target sdk of the project.
     */
    public readonly target: string;

    /**
     * The main entry point of the project.
     */
    public readonly main: string;

    /**
     * Creates a new Project instance.
     * @param name The name of the project.
     * @param target The target sdk of the project.
     * @param main The main entry point of the project.
     */
    public constructor(name: string, target: string, main: string);

    /**
     * Validates the project properties.
     * Throws an exception if any property is null or whitespace.
     */
    public validate(): void;

    /**
     * Creates a Project instance from a JSON string.
     * @param json The JSON string representing the project.
     * @returns A Project instance.
     */
    public static fromJson(json: string): Project;

    /**
     * Asynchronously creates a Project instance from a file.
     * @param filePath The path to the project file.
     * @returns A Promise that resolves to a Project instance.
     */
    public static fromFileAsync(filePath: string): Promise<Project>;
}