/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ParsedRoute, RouteService } from "@contextjs/routing";
import { ObjectExtensions, StringExtensions } from "@contextjs/system";
import { HttpContext, WebServer } from "@contextjs/webserver";
import 'reflect-metadata';
import { VerbRouteInfo } from "../models/verb-route-info.js";

export class ActionExecutorService {
    public static async executeAsync(webServer: WebServer, httpContext: HttpContext, defaultController: string, defaultAction: string): Promise<any> {
        let requestUrl = httpContext.request.path;
        if (StringExtensions.isNullOrWhitespace(requestUrl))
            return await this.serverErrorAsync(httpContext, "Request URL is empty");

        const requestUrlSegments = RouteService.getSegments(requestUrl);
        if (requestUrlSegments.length === 0)
            requestUrl = `/${defaultController}/${defaultAction}`;
        else if (requestUrlSegments.length === 1)
            requestUrl = `/${requestUrlSegments[0]}/${defaultAction}`;

        const routeDefinitions = webServer.application.routes
            .filter(t => t.route instanceof VerbRouteInfo && t.route.verb === httpContext.request.method);

        const parsedRoute = RouteService.match(requestUrl, routeDefinitions);
        if (ObjectExtensions.isNullOrUndefined(parsedRoute))
            return await this.notFoundAsync(httpContext);

        const controllerName = parsedRoute?.definition.className;
        if (StringExtensions.isNullOrWhitespace(controllerName))
            return await this.notFoundAsync(httpContext);

        const actionName = parsedRoute?.definition.methodName;
        if (StringExtensions.isNullOrWhitespace(actionName))
            return await this.notFoundAsync(httpContext);

        const controllerInstance = webServer.application.services.resolve(controllerName);
        if (ObjectExtensions.isNullOrUndefined(controllerInstance))
            return await this.notFoundAsync(httpContext);

        const handler = (controllerInstance as any)[actionName];
        if (typeof handler !== "function")
            return await this.notFoundAsync(httpContext);

        const action = handler.bind(controllerInstance);
        const parameters = ActionExecutorService.getParameters(controllerInstance, actionName, httpContext, parsedRoute as ParsedRoute);

        const result = await action(...parameters);
        if (ObjectExtensions.isNullOrUndefined(result))
            return await this.noContentAsync(httpContext);

        return await this.okAsync(httpContext, result);
    }

    private static getParameters(controller: any, actionName: string, httpContext: HttpContext, parsedRoute?: ParsedRoute) {
        const parameterNames = this.parseFunctionArguments(controller[actionName]);
        const parameterTypes = Reflect.getMetadata('design:paramtypes', controller, actionName) || [];
        const rawSegments = RouteService.getSegments(httpContext.request.path);

        return parameterNames.map((name, index) => {
            const type = parameterTypes[index];

            if (type === HttpContext || (type && HttpContext.prototype.isPrototypeOf(type.prototype)))
                return httpContext;

            if (parsedRoute && parsedRoute.parameters.has(name))
                return parsedRoute.parameters.get(name);

            return rawSegments[index];
        });
    }

    private static parseFunctionArguments(target: Function): string[] {
        const sanitizedFunctionText = target.toString()
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/mg, '')
            .replace(/[\r\n]/g, ' ');

        const extractedArguments = sanitizedFunctionText.slice(sanitizedFunctionText.indexOf('(') + 1, sanitizedFunctionText.indexOf(')'));
        return extractedArguments.match(/([^,\s]+)/g) || [];
    }

    private static async notFoundAsync(httpContext: HttpContext): Promise<void> {
        httpContext.response.setStatus(404, "Not Found");
        await httpContext.response.endAsync();
    }

    private static async noContentAsync(httpContext: HttpContext): Promise<void> {
        httpContext.response.setStatus(204, "No Content");
        await httpContext.response.endAsync();
    }

    private static async serverErrorAsync(httpContext: HttpContext, message: string): Promise<void> {
        httpContext.response.setStatus(500, "Server Error");
        await httpContext.response.sendAsync(`Server Error: ${message}`);
    }

    private static async okAsync(httpContext: HttpContext, result: any): Promise<void> {
        if (!ObjectExtensions.isNullOrUndefined(result) && typeof result.executeAsync === "function")
            return await result.executeAsync(httpContext);

        const isString = typeof result === "string";
        const contentType = isString
            ? "text/plain; charset=utf-8"
            : "application/json";

        httpContext.response.setHeader("Content-Type", contentType);
        httpContext.response.setStatus(200, "OK");
        await httpContext.response.sendAsync(isString ? result : JSON.stringify(result));
    }
}