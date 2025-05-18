/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import "@contextjs/system";

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
 * Provides matching logic to resolve a route from a path.
 */
export declare class RouteService {
    /**
     * Finds the best matching route for a given path.
     * @param value The request path (e.g., "home/123").
     * @param routes The available routes to match against.
     * @returns The matching route, or null if no match was found.
     */
    public static match(value: string, routes: RouteInfo[]): RouteInfo | null;
}

//#region Extensions

declare module "@contextjs/system" {
    /**
     * Adds routing configuration to the Application interface.
     */
    export interface Application {
        /**
         * The current route configuration.
         */
        routeConfiguration: RouteConfiguration;

        /**
         * Configures routing for the application.
         * @param options A callback that receives a RouteOptions object to configure routing.
         * @returns The current Application instance.
         */
        useRouting(options: (routeOptions: RouteOptions) => void): Application;
    }
}

/**
 * Defines the routing configuration for an application.
 */
export declare class RouteConfiguration {
    /**
     * Whether route discovery is enabled.
     */
    public discoverRoutes: boolean;

    /**
     * The list of routes for the application.
     * When route discovery is enabled, discovered routes are added here.
     */
    public routes: RouteInfo[];
}

/**
 * Provides a fluent interface to configure routing behavior.
 */
export declare class RouteOptions {
    /**
     * Enables route discovery.
     * @returns The current RouteOptions instance.
     */
    public discoverRoutes(): RouteOptions;

    /**
     * Enables or disables route discovery.
     * @param value True to enable discovery, false to disable.
     * @returns The current RouteOptions instance.
     */
    public discoverRoutes(value: boolean): RouteOptions;

    /**
     * Sets the routes to use explicitly.
     * @param routes The routes to apply.
     * @returns The current RouteOptions instance.
     */
    public useRoutes(routes: RouteInfo[]): RouteOptions;
}

//#endregion