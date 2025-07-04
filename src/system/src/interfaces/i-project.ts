/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export interface IProject {
    name: string;
    type: string;
    main: string;
    files: string[];
    extensions?: string[];
}