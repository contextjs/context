/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../models/file-template.js";

export class AboutControllerTemplate {
  private static readonly name = "src/controllers/about.controller.ts";
  private static readonly content = `import { Controller, Get } from "@contextjs/webserver-middleware-controllers";
import type { IMessageService } from "../services/interfaces/i-message.service.js";

@Controller()
export class AboutController {
    private readonly messageService: IMessageService;

    public constructor(messageService: IMessageService) {
        this.messageService = messageService;
    }

    @Get("index")
    public async index() {
        return this.messageService.display("AboutController index method called");
    }
}`

  public static readonly template: FileTemplate = new FileTemplate(AboutControllerTemplate.name, AboutControllerTemplate.content);
}