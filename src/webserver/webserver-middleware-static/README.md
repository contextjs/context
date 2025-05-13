# @contextjs/webserver-middleware-static

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-static?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-static)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Static files middleware for the ContextJS webserver.

## Installation

```bash
npm i @contextjs/webserver-middleware-static
```

## Usage

Import the prototype extension and configure `WebServerOptions` to serve static files:

```ts
import { WebServer } from "@contextjs/webserver";
import "@contextjs/webserver-middleware-static";

const server = new WebServer(options => {
    options.useStaticFiles(static => {
        static.publicFolder = "assets";
        static.fileExtensions = [".html", ".js", ".css"];
    });
});

await server.listenAsync();
```

Or use it in Application:

```ts
import { Application } from "@contextjs/system";
import "@contextjs/webserver";
import { WebServerOptions } from "@contextjs/webserver";
import "@contextjs/webserver-middleware-static";

const application = new Application();

application.useWebServer((options: WebServerOptions) => {
    options.useStaticFiles(staticFileOptions => {
        staticFileOptions.publicFolder = "/path-to-your-public-folder";
        // Allow only these file types
        staticFileOptions.fileExtensions = ["html", "js", "css"];
        // staticFileOptions.fileExtensions = []; // Allow all file types
    })
    options.onEvent = (event) => console.log(event.type, event.detail);

    options.useMiddleware({
        name: "benchmark",
        version: "1.0.0",
        onRequest: async (context) => {
            context.response
                .setHeader("Content-Type", "text/plain; charset=utf-8")
                .setHeader("X-Custom", "benchmark")
                .send("OK");
        }
    });
});

await application.runAsync();
```

## API Reference

### WebServerOptions Extension

```ts
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        /**
         * Registers middleware to serve static files.
         * @param options Callback used to configure static file behavior.
         */
        useStaticFiles(options: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}
```

### StaticFilesOptions

```ts
export class StaticFilesOptions {
    /**
     * Gets or sets the public folder from which static files are served.
     * Defaults to "public".
     */
    public publicFolder: string;

    /**
     * Gets or sets the list of allowed file extensions.
     * If empty, all file types are allowed.
     */
    public fileExtensions: string[];
}
```