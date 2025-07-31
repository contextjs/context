/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class PathMapping {
    public readonly source: string;
    public readonly destination: string;

    public constructor(source: string, destination: string) {
        this.source = source;
        this.destination = destination;
    }
}