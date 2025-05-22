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
export declare class RouteDefinition<T extends RouteInfo = RouteInfo> {
    /** The path to the module where the route is defined. */
    public importPath: string;
    /** The class reference for the route handler. */
    public classReference: Function | null;
    /** The name of the method in the class that handles the route. */
    public methodName: string | null;
    /** The route information. */
    public route: T;

    /**
     * Creates a new route definition.
     * @param importPath The path to the module where the route is defined.
     * @param classReference The class reference for the route handler.
     * @param methodName The name of the method in the class that handles the route.
     * @param route The route information.
     */
    constructor(importPath: string, classReference: Function | null, methodName: string | null, route: T);
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