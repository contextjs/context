/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Diagnostic } from "@contextjs/views";
import { ParserResult } from "@contextjs/views-parser";

/**
 * Represents the context for compilation, including project details and file handling.
 */
export declare class CompilationContext {
    /*
     * The root directory of the project.
     */
    projectRoot: string;

    /*
     * An array of file paths included in the compilation.
     */
    files: string[];

    /*
     * The project configuration as a record of key-value pairs.
     */
    project: Record<string, any>;

    /*
     * A function to asynchronously retrieve the content of a file given its path.
     */
    getFileContentAsync: (filePath: string) => Promise<string>;

    /*
     * A flag indicating whether to generate source maps during compilation.
     */
    generateSourceMap: boolean;

    /**
     * Constructs a new CompilationContext.
     * @param projectRoot The root directory of the project.
     * @param files An array of file paths included in the compilation.
     * @param project The project configuration as a record of key-value pairs.
     * @param getFileContentAsync A function to asynchronously retrieve the content of a file given its path.
     * @param generateSourceMap A flag indicating whether to generate source maps during compilation (default is true).
     */
    public constructor(
        projectRoot: string,
        files: string[],
        project: Record<string, any>,
        getFileContentAsync: (filePath: string) => Promise<string>,
        generateSourceMap: boolean);
}

/**
 * Represents a compiled view with its associated metadata and data.
 * @template T The type of the data contained in the compiled view.
 */
export declare class CompiledView<T = unknown> {
    /*
     * The source file path
     */
    public readonly filePath: string;

    /*
     * The kind of the project
     */
    public readonly kind: string;

    /*
     * An array of diagnostics associated with the compilation.
     */
    public readonly diagnostics: Diagnostic[];

    /*
     * The data associated with the compiled view.
     */
    public readonly data: T;

    /**
     * Constructs a new CompiledView.
     * @param filePath The source file path.
     * @param kind The kind of the project.
     * @param diagnostics An array of diagnostics associated with the compilation.
     * @param data The data associated with the compiled view.
     */
    public constructor(
        filePath: string,
        kind: string,
        diagnostics: Diagnostic[],
        data: T);
}

/**
 * The main entry point for the Views Compiler, responsible for compiling views based on the provided context.
 */
export declare class ViewsCompiler {

    /*
     * Constructs a new ViewsCompiler.
     * @param context The compilation context containing project details and file handling.
     */
    public constructor(context: CompilationContext);

    /**
     * Compiles all files in the compilation context.
     * @returns A promise that resolves to an array of compiled views.
     */
    public compileAllAsync(): Promise<CompiledView[]>;

    /**
     * Compiles a single file in the compilation context.
     * @param filePath The path of the file to compile.
     * @returns A promise that resolves to the compiled view.
     */
    public compileFileAsync(filePath: string): Promise<CompiledView>;
}

/**
 * Represents the data associated with a compiled view on the server.
 */
export declare class ServerCompiledViewData {
    /*
     * The source code of the compiled view.
     */
    public readonly source: string;

    /*
     * The source map of the compiled view, if available.
     */
    public readonly sourceMap: string | null;

    /*
     * The class name generated for the compiled view.
     */
    public readonly className: string;

    /*
     * The name of the generated file for the compiled view.
     */
    public readonly generatedFileName: string;

    /*
     * The parser result associated with the compiled view.
     */
    public readonly parserResult: ParserResult;

    /**
     * Constructs a new ServerCompiledViewData.
     * @param source The source code of the compiled view.
     * @param sourceMap The source map of the compiled view, if available.
     * @param className The class name generated for the compiled view.
     * @param generatedFileName The name of the generated file for the compiled view.
     * @param parserResult The parser result associated with the compiled view.
     */
    public constructor(
        source: string,
        sourceMap: string | null,
        className: string,
        generatedFileName: string,
        parserResult: ParserResult)
}