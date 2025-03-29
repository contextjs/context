/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";

export class ProgramTemplate {
  private static readonly name = "src/program.ts";
  private static readonly content = `import { Application } from '@contextjs/system';

const application = new Application();

application.onRun(async () => {
    console.log('Application is running');
});

application.runAsync();`

  public static readonly template: FileTemplate = new FileTemplate(ProgramTemplate.name, ProgramTemplate.content);
}