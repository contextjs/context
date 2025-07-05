/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../models/file-template.js";

export class MainTemplate {
  private static readonly name = "src/main.ts";
  private static readonly content = `import "@contextjs/webserver";
import "@contextjs/webserver-middleware-controllers";
import "./services/service-collection.extensions.js";

import { Application } from "@contextjs/system";
import { WebServerOptions } from "@contextjs/webserver";

const application = new Application();

application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useControllers();
});

application.services.registerServices();

await application.runAsync();`

  public static readonly template: FileTemplate = new FileTemplate(MainTemplate.name, MainTemplate.content);
}