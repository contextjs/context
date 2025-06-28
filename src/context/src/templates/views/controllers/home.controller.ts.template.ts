/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../models/file-template.js";

export class HomeControllerTemplate {
    private static readonly name = "src/controllers/home.controller.ts";
    private static readonly content = `import { Controller, Get, IActionResult, Ok } from "@contextjs/webserver-middleware-controllers";
import type { ILoggerService } from "../services/interfaces/i-logger.service.js";

@Controller()
export class HomeController {
    private readonly loggerService: ILoggerService;

    public constructor(loggerService: ILoggerService) {
        this.loggerService = loggerService;
    }

    @Get("index")
    public async index(): Promise<IActionResult> {
        this.loggerService.log("HomeController index method called");
        return Ok("Welcome to the Home Page!");
    }
}`

    public static readonly template: FileTemplate = new FileTemplate(HomeControllerTemplate.name, HomeControllerTemplate.content);
}