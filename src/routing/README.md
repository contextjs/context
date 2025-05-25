# @contextjs/routing

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/routing?cache=300)](https://www.npmjs.com/package/@contextjs/routing)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Declarative, extensible route matching and configuration for ContextJS-based applications.

## ✨ Features

- Fully type-safe and fluent route configuration
- Support for literal, parameterized, optional, and catch-all route templates
- Fast route matching with scoring and early-exit optimization
- URI decoding, normalization, and edge-case tolerance
- Integration with the `Application` class via `useRouting()`

## 📦 Installation

```bash
npm i @contextjs/routing
```

## 🚀 Usage

```ts
import { Application } from "@contextjs/system";
import { RouteInfo } from "@contextjs/routing";

const app = new Application();
app.useRouting();
```

## 🔍 Matching Example

```ts
import { RouteService } from "@contextjs/routing";

const route = RouteService.match("home/123/details", [...routeDefinitions]);

console.log(route?.template); // "home/{id?}/details"
```

## 📘 API Reference

### Decorator

```ts
/**
 * Decorates a method as a route handler.
 * @param template The URL template for the route.
 * @param name The name of the route (optional).
 */
export declare function Route(template: string, name?: string): MethodDecorator;
```

### `RouteInfo`

Represents a route with a URL template and optional name.

```ts
new RouteInfo(template: string);
new RouteInfo(template: string, name: string);
```

- `template`: The route’s URL template (e.g., `"users/{id}"`)
- `name`: Optional route name

### `RouteService`

Provides matching logic to resolve a route from a path.

```ts
public static match(value: string, routes: RouteDefinition[]): RouteDefinition | null;
```

- `path`: Request path (e.g., `"users/42"`)
- `routes`: Array of `RouteDefinition` instances to search
- **Returns**: the best match or `null` if no match

### `Application.useRouting`

Adds routing configuration to the ContextJS `Application`.

```ts
app.useRouting();
```


### `RouteDefinition`
```ts
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
```

## 🧪 Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.