/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { VersionService } from "@contextjs/core";
import { FileTemplate } from "../../models/file-template.js";

export class PackageTemplate {
  private static readonly name = "package.json";
  private static readonly content = `{
  "name": "{{name}}",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "dependencies": {
    "@contextjs/core": "${VersionService.get()}"
  }
}`;

  public static readonly template: FileTemplate = {
    name: PackageTemplate.name,
    content: PackageTemplate.content
  };
}