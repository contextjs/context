# @contextjs/webserver-middleware-controllers

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-controllers?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-controllers)
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

```ts
import { WebServer } from '@contextjs/webserver';
import { Controller, Get } from '@contextjs/webserver-middleware-controllers';

@Controller('home')
class HomeController {
    @Get('index')
    index() {
        return 'Hello from HomeController!';
    }
}

const server = new WebServer();
server.configure(options => options.useControllers());
await server.listenAsync(3000);
```

Requests to `/home/index` will be routed to the `index()` method of `HomeController`.

## Configuration

You can optionally customize the default controller and action name:

```ts
server.configure(options => options.useControllers(config => {
    config.defaultController = 'home';
    config.defaultAction = 'index';
}));
```

## Controller Auto-Discovery

Controllers are discovered automatically from the `outDir` specified in your `tsconfig.json`. You must compile your controllers to `.js` or `.mjs` files. Supported `module` formats are `ESNext` and `CommonJS`.

## API Reference

```ts
/**
 * Defines the Controller decorator, which is used to mark a class as a controller.
 * The optional template parameter specifies the base route for the controller.
 */
export declare function Controller(template?: string): ClassDecorator;

/**
 * Defines the Get decorator for methods in a controller.
 * This decorator marks a method to handle HTTP GET requests.
 */
export declare function Get(template: string): MethodDecorator;

/**
 * Defines the Post decorator for methods in a controller.
 * This decorator marks a method to handle HTTP POST requests.
 */
export declare function Post(template: string): MethodDecorator;

/**
 * Defines the Put decorator for methods in a controller.
 * This decorator marks a method to handle HTTP PUT requests.
 */
export declare function Put(template: string): MethodDecorator;

/**
 * Defines the Delete decorator for methods in a controller.
 * This decorator marks a method to handle HTTP DELETE requests.
 */
export declare function Delete(template: string): MethodDecorator;

/**
 * Extends WebServerOptions to enable controller support.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useControllers(configure?: (controllersOptions: ControllerOptions) => void): WebServerOptions;
    }
}

/**
 * Defines the ControllerOptions class, which is used to configure default controller and action names.
 */
export declare class ControllerOptions {
    public defaultController: string;
    public defaultAction: string;
}

/**
 * Represents an HTTP verb-specific route.
 */
export declare class VerbRouteInfo extends RouteInfo {
    public readonly verb: HttpVerb;
    constructor(verb: HttpVerb, template: string);
}

/**
 * Describes a controller definition including name, class reference, and optional route.
 */
export declare class ControllerDefinition {
    public readonly name: string;
    public readonly classReference: Function;
    public readonly route?: RouteInfo;
    constructor(name: string, classReference: Function, route?: RouteInfo);
}
```
