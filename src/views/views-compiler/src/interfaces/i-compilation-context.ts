/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/**
 * Represents the context for a single compilation operation.
 * Provides access to all relevant files, loaders, and config.
 */
export interface ICompilationContext {
    projectRoot: string;
    files: string[];              // All known view/template files
    layouts?: string[];           // Layout files (optional/future)
    partials?: string[];          // Partial/include files (optional/future)
    getFileContent(path: string): Promise<string>; // Abstract file loader
    config?: Record<string, unknown>; // Raw context.ctxp/config object (optional)
}