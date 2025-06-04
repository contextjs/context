/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "@contextjs/routing";
import "@contextjs/webserver";
import { HttpContext, HttpVerb } from "@contextjs/webserver";

/**
 * Defines the Controller decorator, which is used to mark a class as a controller.
 * The optional template parameter specifies the base route for the controller.
 * @param template - The base route for the controller.
 * @return A class decorator that marks the class as a controller.
 */
export declare function Controller(template?: string): ClassDecorator;

/**
 * Defines the Get decorator for methods in a controller.
 * This decorator marks a method to handle HTTP GET requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle GET requests.
 */
export declare function Get(template: string): MethodDecorator;

/**
 * Defines the Post decorator for methods in a controller.
 * This decorator marks a method to handle HTTP POST requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle POST requests.
 */
export declare function Post(template: string): MethodDecorator;

/**
 * Defines the Put decorator for methods in a controller.
 * This decorator marks a method to handle HTTP PUT requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle PUT requests.
 */
export declare function Put(template: string): MethodDecorator;

/**
 * Defines the Delete decorator for methods in a controller.
 * This decorator marks a method to handle HTTP DELETE requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle DELETE requests.
 */
export declare function Delete(template: string): MethodDecorator;

/**
 * Extends the WebServerOptions interface with a method to configure controllers.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useControllers(configure?: (controllersOptions: ControllerOptions) => void): WebServerOptions;
    }
}

/**
 * Defines the ControllerOptions class, which is used to configure default controller and action names.
 */
export declare class ControllerOptions {
    /**
     * The default controller name.
     */
    public defaultController: string;

    /**
     * The default action name.
     */
    public defaultAction: string;
}

/**
 * Defines the VerbRouteInfo class, which extends RouteInfo to include an HTTP verb.
 */
export declare class VerbRouteInfo extends RouteInfo {

    /**
     * The HTTP verb for the route.
     */
    public readonly verb: HttpVerb;

    /**
     * Creates an instance of VerbRouteInfo.
     * @param verb - The HTTP verb for the route.
     * @param template - The route template.
     */
    constructor(verb: HttpVerb, template: string);
}

/**
 * Defines the ControllerDefinition class, which represents a controller with its name, class reference, and optional route.
 */
export declare class ControllerDefinition {

    /**
     * The name of the controller.
     */
    public readonly name: string;

    /**
     * The class reference for the controller.
     */
    public readonly classReference: Function;

    /**
     * An optional RouteInfo object representing the route for the controller.
     */
    public readonly route?: RouteInfo;

    /**
     * Creates an instance of ControllerDefinition.
     * @param name - The name of the controller.
     * @param classReference - The class reference for the controller.
     * @param route - An optional RouteInfo object representing the route for the controller.
     */
    constructor(name: string, classReference: Function, route?: RouteInfo);
}

/**
 * Represents an action result that can execute and write to the HTTP context.
 */
export declare interface IActionResult {
    /**
     * Executes the result, writing to the given HTTP context.
     * @param httpContext - The HTTP context.
     */
    executeAsync(httpContext: HttpContext): Promise<any>;
}

/**
 * Returns a result indicating a successful response with status 200 ("OK") and an optional string value as the response body.
 * @param value - The response body as a string.
 */
export declare function OK(value?: string): IActionResult;

/**
 * Returns a result that serializes the given value as JSON and responds with status 200 ("OK").
 * @param value - The value to serialize as JSON.
 */
export declare function Json(value: any): IActionResult;

/**
 * Returns a result indicating a successful response with status 204 ("No Content").
 */
export declare function NoContent(): IActionResult;

/**
 * Returns a result indicating a successful response with no body and no modification to status code.
 */
export declare function Empty(): IActionResult;

/**
 * Returns a result indicating a response with status 400 ("Bad Request") and an optional message as the response body.
 * @param message - The optional error message.
 */
export declare function BadRequest(message?: string): IActionResult;

/**
 * Returns a result indicating a response with status 401 ("Unauthorized").
 */
export declare function Unauthorized(): IActionResult;

/**
 * Returns a result indicating a response with status 403 ("Forbidden").
 */
export declare function Forbidden(): IActionResult;

/**
 * Returns a result indicating a response with status 404 ("Not Found").
 */
export declare function NotFound(): IActionResult;

/**
 * Returns a result indicating a response with status 201 ("Created"), an optional value as the response body, and an optional "Location" header.
 * @param value - The response body as a string.
 * @param location - The optional Location header value.
 */
export declare function Created(value?: string, location?: string): IActionResult;

/**
 * Returns a result with custom content, content-type, status code, and reason phrase.
 * @param content - The content to write to the response.
 * @param contentType - The content-type header value.
 * @param statusCode - The HTTP status code.
 * @param statusMessage - The HTTP reason phrase.
 */
export declare function Content(content: string, contentType?: string, statusCode?: number, statusMessage?: string): IActionResult;