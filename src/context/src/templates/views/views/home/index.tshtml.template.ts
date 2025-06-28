/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../../models/file-template.js";

export class HomeControllerIndexViewTemplate {
    private static readonly name = "src/views/home/index.tshtml";
    private static readonly content = `<h1>Home Page</h1>`;

    public static readonly template: FileTemplate = new FileTemplate(HomeControllerIndexViewTemplate.name, HomeControllerIndexViewTemplate.content);
}