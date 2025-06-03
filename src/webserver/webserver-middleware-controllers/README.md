# @contextjs/webserver-middleware-controllers

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-controllers?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-controllers)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Controllers middleware for the ContextJS webserver.

## Installation

```bash
npm i @contextjs/webserver-middleware-controllers
```

## Overview

This package provides attribute-based routing support for the ContextJS webserver. It introduces a controller and verb decorator model, allowing you to build organized, testable route handlers similar to established MVC patterns.

## Features

- Attribute-based route mapping using `@Controller`, `@Get`, `@Post`, `@Put`, and `@Delete`
- Auto-discovery of compiled `.js` or `.mjs` controllers
- Customizable default controller and action fallbacks
- Integration via `.useControllers()` on `WebServerOptions`

## Usage

```typescript
import "@contextjs/di";
import "@contextjs/webserver";
import "@contextjs/webserver-middleware-controllers";

import { Application } from "@contextjs/system";
import { WebServerOptions } from "@contextjs/webserver";
import { Controller, Get } from "@contextjs/webserver-middleware-controllers";

interface ILoggerService {
    log(message: string): void;
}

class LoggerService implements ILoggerService {
    log(message: string): void {
        console.log(message);
    }
}

@Controller()
class HomeController {
    private readonly loggerService: ILoggerService;

    public constructor(loggerService: ILoggerService) {
        this.loggerService = loggerService;
    }

    @Get("index")
    public async index() {
        this.loggerService.log("HomeController index method called");
        return "Home";
    }
}

const application = new Application();

application.useDependencyInjection();

application.services.addTransient<ILoggerService, LoggerService>();

application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useControllers();
});

await application.runAsync();
```

Requests to `/home/index` will be routed to the `index()` method of `HomeController`.

## Configuration

You can optionally customize the default controller and action name:

```typescript
application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useControllers(controllerOptions => {
        controllerOptions.defaultController = "about";
        controllerOptions.defaultAction = "index";
    });
});
```

## Controller Auto-Discovery

Controllers are discovered automatically from the `outDir` specified in your `tsconfig.json`. You must compile your controllers to `.js` or `.mjs` files.

## API Reference
For detailed API documentation, please refer to <a href="https://contextjs.dev/api/webserver-middleware-controllers#api-reference" target="_blank" rel="noopener noreferrer">API Reference</a>
<span style="font-size:0.75em;vertical-align:super;">↗️</span>