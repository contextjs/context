/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../../models/file-template.js";

export class AboutControllerIndexViewTemplate {
    private static readonly name = "src/views/about/index.tshtml";
    private static readonly content = `<h1>About Page</h1>`;

    public static readonly template: FileTemplate = new FileTemplate(AboutControllerIndexViewTemplate.name, AboutControllerIndexViewTemplate.content);
}