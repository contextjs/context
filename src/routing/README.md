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
import { Route } from "@contextjs/routing";

const app = new Application();

app.useRouting(r => {
    r.useRoutes([
        new Route("home/{id}", "home"),
        new Route("home/{id?}/details", "homeDetails")
    ]);
});
```

## 🔍 Matching Example

```ts
import { RouteService } from "@contextjs/routing";

const route = RouteService.match("home/123/details", [
    new Route("home/{id}"),
    new Route("home/{id?}/details")
]);

console.log(route?.template); // "home/{id?}/details"
```

## 📘 API Reference

### `Route`

Represents a route with a URL template and optional name.

```ts
new Route(template: string);
new Route(template: string, name: string);
```

- `template`: The route’s URL template (e.g., `"users/{id}"`)
- `name`: Optional route name

### `RouteService`

Provides matching logic to resolve a route from a path.

```ts
RouteService.match(path: string, routes: Route[]): Route | null
```

- `path`: Request path (e.g., `"users/42"`)
- `routes`: Array of `Route` instances to search
- **Returns**: the best match or `null` if no match

### `Application.useRouting`

Adds routing configuration to the ContextJS `Application`.

```ts
app.useRouting(options => {
    options.discoverRoutes();
    options.useRoutes([...]);
});
```

- `routeConfiguration`: Access the app's `RouteConfiguration` directly
- `useRouting(fn)`: Configures routing using a fluent builder

### `RouteConfiguration`

Defines the routing configuration for an application.

```ts
interface RouteConfiguration {
    discoverRoutes: boolean;
    routes: Route[];
}
```

- `discoverRoutes`: Enables auto-discovery of routes (if supported)
- `routes`: The configured or discovered routes

### `RouteOptions`

Fluent configuration API for routing.

```ts
routeOptions.discoverRoutes();                // enable
routeOptions.discoverRoutes(false);          // disable
routeOptions.useRoutes([new Route("x")]);    // assign routes
```

---

## 🧪 Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.