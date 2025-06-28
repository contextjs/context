/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/**
 * Represents a compiled view module that can render HTML from a model object.
 * The interface can be extended for async rendering, hydration, or additional metadata in the future.
 */
export declare interface IView<TModel = any> {
    /**
     * Renders the view using the provided model data.
     * @param model - The data model for the view (shape is view-dependent).
     * @returns Rendered HTML as a string.
     */
    render(model: TModel): string;

    /**
     * Optional metadata about the view (e.g., original file path, name).
     */
    metadata?: {
        filePath: string;
        name?: string;
        [key: string]: unknown;
    };
}
