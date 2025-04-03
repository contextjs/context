# @contextjs/routing

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/routing)](https://www.npmjs.com/package/@contextjs/configuration-json)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Routing

### Installation
```
npm i @contextjs/routing
```

### Classes

```typescript
/**
 * Represents a route
 */
export declare class Route {

    /** The template of the route. */
    public readonly template: string;

    /** The name of the route. Optional. */
    public readonly name: string | null;

    /**
     * Creates a new instance of the Route class.
     * 
     * @param template The template of the route.
     * @returns A new instance of the Route class.
     */
    public constructor(template: string);

    /**
     * Creates a new instance of the Route class.
     * 
     * @param template The template of the route.
     * @param name The name of the route.
     * @returns A new instance of the Route class.
     */
    public constructor(template: string, name: string);
}
```

### Services

```typescript
/**
 * Parses a route and finds the best match for the given value.
 */
export declare class RouteService {
    /**
     * Finds a route that matches the given value
     * @param value The value to parse
     * @param routes The routes to search
     * @returns The route that matches the value or null if no route was found
     */
    public static match(value: string, routes: Route[]): Route | null;
}
```

### Extensions

```typescript
declare module "@contextjs/system" {
    /**
    * Interface for extending the Application.
    */
    export interface Application {
        /**
         * The route configuration for the application.
         */
        routeConfiguration: RouteConfiguration;

        /**
         * Configures the routing options for the application.
         * @param options A function that takes a RouteOptions object to configure routing options.
         * @returns The current instance of the Application.
         */
        useRouting(options: (routeOptions: RouteOptions) => void): Application;
    }
}

/**
 * Configures the routing options for the application.
 */
export declare class RouteConfiguration {
    /**
     * Indicates whether it should use routes discovery.
     */
    public discoverRoutes: boolean;

    /**
     * The routes to be used.
     * If discoverRoutes is true, this property will add the discovered routes.
     */
    public routes: Route[];
}

/**
 * RouteOptions class for configuring routing options.
 * It allows the user to specify whether to use routes discovery or to provide a list of routes, or both.
 */
export declare class RouteOptions {
    /**
     * Indicates whether to use routes discovery. This property is set to true by default.
     * @returns {RouteOptions} - The current instance of RouteOptions.
     */
    public discoverRoutes(): RouteOptions;

    /**
     * Sets the routes discovery option.
     * @param value - A boolean value indicating whether to use routes discovery or not.
     * @returns {RouteOptions} - The current instance of RouteOptions.
     */
    public discoverRoutes(value: boolean): RouteOptions;

    /**
     * Sets the routes to be used.
     * @param routes The array of routes to be used.
     * @returns The current instance of RouteOptions.
     */
    public useRoutes(routes: Route[]): RouteOptions;
}
```