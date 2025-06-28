/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../../../models/file-template.js";

export class ServiceCollectionExtensionsTemplate {
    private static readonly name = "src/services/service-collection.extensions.ts";
    private static readonly content = `import "@contextjs/di";

import { ServiceCollection } from "@contextjs/di";
import type { ILoggerService } from "./interfaces/i-logger.service.js";
import type { IMessageService } from "./interfaces/i-message.service.js";
import { LoggerService } from "./logger.service.js";
import { MessageService } from "./message.service.js";

declare module "@contextjs/di" {
    export interface ServiceCollection {
        registerServices(): void;
    }
}

ServiceCollection.prototype.registerServices = function (): void {
    this.addTransient<ILoggerService, LoggerService>();
    this.addTransient<IMessageService, MessageService>();
};`

    public static readonly template: FileTemplate = new FileTemplate(ServiceCollectionExtensionsTemplate.name, ServiceCollectionExtensionsTemplate.content);
}