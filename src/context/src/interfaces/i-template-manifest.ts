/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { ICommandManifest } from "./i-command-manifest.js";

export interface ITemplateManifest {
    title: string;
    path: string;
    description: string;
    commands: Dictionary<string, ICommandManifest>;
}