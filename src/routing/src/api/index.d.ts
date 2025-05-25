/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/system";

declare module "@contextjs/system" {
    /**
     * Adds routing configuration to the Application interface.
     */
    export interface Application {
        /**
         * The list of routes defined in the application.
         */
        routes: RouteDefinition[];

        /**
         * Configures routing for the application.
         * @returns The current Application instance.
         */
        useRouting(): Application;
    }
}

/**
 * Decorates a method as a route handler.
 * @param template The URL template for the route.
 * @param name The name of the route (optional).
 */
export declare function Route(template: string, name?: string): MethodDecorator;

/**
 * Represents a route with a URL template and optional name.
 */
export declare class RouteInfo {
    /** The route's URL template (e.g., "home/{id}"). */
    public readonly template: string;

    /** The route's name, or null if unnamed. */
    public readonly name: string | null;

    /** The decoded version of the route's template.*/
    public readonly decodedTemplate: string;

    /**
     * Creates a new route.
     * @param template The route's URL template.
     * @param name The route's name.
     */
    public constructor(template: string, name?: string | null);
}

/**
 * Represents a route definition, including the import path, class reference, method name, and route information.
 */
export class RouteDefinition<T extends RouteInfo = RouteInfo> {
    /**
     * The import path of the module where the route is defined.
     */
    public readonly importPath: string;

    /**
     * The class name of the route handler, or null if not applicable.
     * This is typically used for class-based controllers.
     */
    public readonly className: string | null;

    /**
     * The method name of the route handler, or null if not applicable.
     * This is typically used for class-based controllers.
     */
    public readonly methodName: string | null;

    /**
     * Indicates whether the method name is asynchronous.
     * This is determined by checking if the method's constructor name is "AsyncFunction".
     */
    public readonly isMethodNameAsync: boolean;

    /**
     * The route information, which includes the URL template and name.
     */
    public readonly route: T;

    /**
     * Creates a new route definition.
     * @param importPath The path to the module where the route is defined.
     * @param className The class name of the route handler, or null if not applicable.
     * @param methodName The method name of the route handler, or null if not applicable.
     * @param isMethodNameAsync Indicates if the method is asynchronous.
     * @param route The route information.
     */
    public constructor(importPath: string, className: string | null, methodName: string | null, isMethodNameAsync: boolean, route: T);
}

/**
 * Provides matching logic to resolve a route from a path.
 */
export declare class RouteService {
    /**
     * Finds the best matching route for a given path.
     * @param value The request path (e.g., "home/123").
     * @param routes The available route definitions to match against.
     * @returns The matching route definition, or null if no match was found.
     */
    public static match(value: string, routes: RouteDefinition[]): RouteDefinition | null;
}