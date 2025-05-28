/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { RouteInfo } from "@contextjs/routing";
import "@contextjs/webserver";
import { HttpVerb } from "@contextjs/webserver";

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
 * This class is used to set default values for the controller and action names in the web server.
 * @param defaultController - The default controller name.
 * @param defaultAction - The default action name.
 * @return An instance of ControllerOptions with the specified default controller and action names.
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
 * This class is used to represent a route with a specific HTTP verb.
 * @param verb - The HTTP verb for the route.
 * @param template - The route template.
 * @return An instance of VerbRouteInfo representing the route with the specified verb.
 * @extends RouteInfo
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
 * This class is used to store metadata about controllers in the web server.
 * @param name - The name of the controller.
 * @param classReference - The class reference for the controller.
 * @param route - An optional RouteInfo object representing the route for the controller.
 * @return An instance of ControllerDefinition representing the controller.
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