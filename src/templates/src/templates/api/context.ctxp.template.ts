/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";

export class ContextTemplate {
  private static readonly name = "{{name}}.ctxp";
  private static readonly content = `{
  "name": "{{name}}",
  "type": "webapi",
  "main": "main.ts"
}`;

  public static readonly template: FileTemplate = new FileTemplate(ContextTemplate.name, ContextTemplate.content);
}