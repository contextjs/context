/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/di";
import "@contextjs/routing";
import { ObjectExtensions } from "@contextjs/system";
import { WebServer, WebServerOptions } from "@contextjs/webserver";
import "reflect-metadata";
import { ControllersMiddleware } from "../controllers.middleware.js";
import { ControllerDefinition } from "../models/controller-definition.js";
import { ControllerDiscoveryService } from "../services/controller-discovery-service.js";
import { ControllerOptions } from "./controller.options.js";

declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useControllers(configure: (controllersOptions: ControllerOptions) => void): WebServerOptions;
    }
}

WebServerOptions.prototype.useControllers = function (configure: (controllersOptions: ControllerOptions) => void): WebServerOptions {
    if (this.webServer.hasMiddleware("ControllersMiddleware"))
        return this;

    const controllersOptions = new ControllerOptions();

    if (!ObjectExtensions.isNullOrUndefined(configure))
        configure(controllersOptions);

    const controllersMiddleware = new ControllersMiddleware(this.webServer);
    controllersMiddleware.defaultController = controllersOptions.defaultController;
    controllersMiddleware.defaultAction = controllersOptions.defaultAction;

    if (!ObjectExtensions.isNullOrUndefined(this.webServer.application) && ObjectExtensions.isNullOrUndefined(this.webServer.application.routes))
        this.webServer.application.useRouting();

    this.webServer.application.useDependencyInjection();
    this.webServer.useMiddleware(controllersMiddleware);

    this.webServer.application.onRun(async () => {
        const discovered = await ControllerDiscoveryService.discoverAsync();
        this.webServer.application.routes.push(...discovered.routes);
        configureDependencyInjection(this.webServer, discovered.controllers);
    });

    return this;
};

function configureDependencyInjection(webServer: WebServer, controllerDefinitions: ControllerDefinition[]): void {
    controllerDefinitions.forEach(controller => {
        const paramTypes = Reflect.getMetadata("design:paramtypes", controller.classReference) as any[];
        const parameters = !ObjectExtensions.isNullOrUndefined(paramTypes)
            ? paramTypes.map((type, index) => ({ name: `param${index}`, type }))
            : [];

        webServer.application.services.dependenciesAccessor.set(controller.name, {
            lifetime: 'transient',
            type: controller.classReference,
            parameters: parameters
        });
    });
}