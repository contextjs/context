/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript, { SemanticDiagnosticsBuilderProgram } from "typescript";

//#region Interfaces

/**
 * Represents a compiler extension that can contribute custom TypeScript transformers.
 */
export declare interface ICompilerExtension {
    /**
     * The unique name of the extension (used for identification and debugging).
     */
    name: string;

    /**
     * Provides transformer functions for a given TypeScript program.
     *
     * @param program The TypeScript program instance.
     * @returns An object containing optional `before` and `after` transformer arrays.
     */
    getTransformers(program: typescript.Program): {
        before: typescript.TransformerFactory<typescript.SourceFile>[] | null;
        after: typescript.TransformerFactory<typescript.SourceFile>[] | null;
    };
}

/**
 * Optional configuration for the `Compiler.compile()` method.
 */
export declare interface ICompilerOptions {
    /**
     * Additional custom transformers provided by the caller.
     * These will be merged with all registered internal extensions.
     */
    transformers?: typescript.CustomTransformers;

    /**
     * Optional callback invoked for each formatted diagnostic emitted during compilation.
     */
    onDiagnostic?: (diagnostic: typescript.Diagnostic) => void;

    /**
     * Optional TypeScript compiler options that override the default ones.
     * This can be used to customize the compilation process.
     */
    typescriptOptions?: typescript.CompilerOptions;
}

/**
 * Result object returned by `Compiler.compile()`.
 */
export declare interface ICompilerResult {
    /**
     * Indicates whether the TypeScript emit phase completed without errors.
     */
    success: boolean;

    /**
     * Full list of diagnostic messages.
     */
    diagnostics: typescript.Diagnostic[];
}

//#endregion

//#region Compiler

/**
 * Entry point to the ContextJS compiler system.
 * Provides methods for compiling TypeScript projects with internal and custom extensions.
 */
export declare class Compiler {
    /**
     * Compiles a TypeScript project using registered extensions and optional custom transformers.
     *
     * @param projectPath Path to the root of the project (must contain a `tsconfig.json`).
     * @param options Optional compile options including custom transformers and diagnostic hooks.
     * @returns A result object containing the success status and formatted diagnostics.
     */
    public static compile(projectPath: string, options?: ICompilerOptions): ICompilerResult;

    /**
     * Watches a TypeScript project for changes and recompiles it when files change.
     *
     * @param projectPath Path to the root of the project (must contain a `tsconfig.json`).
     * @param options Optional watch options including custom transformers and diagnostic hooks.
     * @returns A watch object that monitors the project for changes and recompiles as needed.
     */
    public static watch(projectPath: string, options?: ICompilerOptions): typescript.WatchOfConfigFile<SemanticDiagnosticsBuilderProgram>;

    /**
     * Registers a new compiler extension.
     * This must be called before `compile()` in order for the extension to participate.
     *
     * @param extension An object implementing `ICompilerExtension`.
     */
    public static registerExtension(extension: ICompilerExtension): void;
}

//#endregion