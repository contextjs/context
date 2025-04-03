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