/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IViewOutputFile } from "./i-view-output-file.js";

export interface IViewOutputProvider {
    writeAsync(file: IViewOutputFile): Promise<void>;

    readAsync(filename: string): Promise<IViewOutputFile | null>;

    deleteAsync(filename: string): Promise<void>;

    listAsync(): Promise<IViewOutputFile[]>;
}