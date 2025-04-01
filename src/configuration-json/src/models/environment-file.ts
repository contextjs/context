/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File, FileNotFoundException } from "@contextjs/io";
import { StringExtensions } from "@contextjs/system";

export class EnvironmentFile {
    public readonly content: string | null;
    public readonly file: string;
    public readonly environmentName: string | null;

    public constructor(
        file: string,
        environmentName: string | null = null) {
        if (!File.exists(file))
            throw new FileNotFoundException(file);

        this.file = file;
        this.environmentName = environmentName;

        const content = File.read(file);
        this.content = StringExtensions.isNullOrWhiteSpace(content)
            ? null
            : JSON.parse(content!);
    }
}