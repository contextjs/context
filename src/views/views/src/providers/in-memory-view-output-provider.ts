/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { IViewOutputFile } from "./interfaces/i-view-output-file.js";
import { IViewOutputProvider } from "./interfaces/i-view-output-provider.js";

export class InMemoryViewOutputProvider implements IViewOutputProvider {
    private readonly files = new Dictionary<string, IViewOutputFile>();

    public async writeAsync(file: IViewOutputFile): Promise<void> {
        this.files.set(file.filename, file);
    }

    public async readAsync(filename: string): Promise<IViewOutputFile | null> {
        const file = this.files.get(filename);
        return file ? { ...file } : null;
    }

    public async deleteAsync(filename: string): Promise<void> {
        this.files.delete(filename);
    }

    public async listAsync(): Promise<IViewOutputFile[]> {
        return this.files.values().map(file => ({ ...file }));
    }
}