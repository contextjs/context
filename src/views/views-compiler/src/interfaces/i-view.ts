/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export interface IView<TModel = any> {
    renderAsync(model: TModel): Promise<string>;

    metadata?: {
        filePath: string;
        name?: string;
        [key: string]: unknown;
    };
}