/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
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
     * Indicates whether the method is asynchronous.
     * This is determined by checking if the method's constructor is "AsyncFunction".
     */
    public readonly isAsync: boolean;

    /**
     * The route information, which includes the URL template and name.
     */
    public readonly route: T;

    /**
     * Creates a new route definition.
     * @param importPath The path to the module where the route is defined.
     * @param className The class name of the route handler, or null if not applicable.
     * @param methodName The method name of the route handler, or null if not applicable.
     * @param isAsync Indicates if the method is asynchronous.
     * @param route The route information.
     */
    public constructor(importPath: string, className: string | null, methodName: string | null, isAsync: boolean, route: T);
}

/**
 * Represents a parsed route, including the route definition and any parameters extracted from the path.
 */
export declare class ParsedRoute {
    /**
     * The route definition that was matched.
     */
    public readonly definition: RouteDefinition;

    /**
     * The parameters extracted from the route path.
     * This is a dictionary where keys are parameter names and values are their corresponding values.
     */
    public readonly parameters: Dictionary<string, any>;

    /**
     * Creates a new parsed route.
     * @param definition The route definition that was matched.
     * @param parameters The parameters extracted from the route path.
     */
    public constructor(definition: RouteDefinition, parameters: Dictionary<string, any>);
}

/**
 * Provides matching logic to resolve a route from a path.
 */
export declare class RouteService {
    /**
     * Finds the best matching route for a given path.
     * @param value The request path (e.g., "home/123").
     * @param routes The available route definitions to match against.
     * @returns The matching ParsedRoute, or null if no match is found.
     */
    public static match(value: string, routes: RouteDefinition[]): ParsedRoute | null;
}