# @contextjs/routing

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/routing?cache=300)](https://www.npmjs.com/package/@contextjs/routing)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Declarative, extensible route matching and configuration for ContextJS-based applications.

## Features

- Fully type-safe and fluent route configuration
- Support for literal, parameterized, optional, and catch-all route templates
- Fast route matching with scoring and early-exit optimization
- URI decoding, normalization, and edge-case tolerance
- Integration with the `Application` class via `useRouting()`

## Installation

```bash
npm i @contextjs/routing
```

## Usage

```ts
import { Application } from "@contextjs/system";
import { RouteInfo } from "@contextjs/routing";

const app = new Application();
app.useRouting();
```

## Matching Example

```ts
import { RouteService } from "@contextjs/routing";

const route = RouteService.match("home/123/details", [...routeDefinitions]);

console.log(route?.template); // "home/{id?}/details"
```

## API Reference
For detailed API documentation, please refer to <a href="https://contextjs.dev/api/routing#api-reference" target="_blank" rel="noopener noreferrer">API Reference</a>
<span style="font-size:0.75em;vertical-align:super;">↗️</span>


## Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.