# @contextjs/webserver-middleware-static

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-static?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-static)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Static files middleware for ContextJS webserver.

### Installation
```
npm i @contextjs/webserver-middleware-static
```


### Extensions

```typescript
/**
 * Extends the WebServerOptions interface with a method to serve static files.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useStaticFiles(options: (staticFilesOptions: StaticFilesOptions) => void): WebServerOptions;
    }
}

/**
 * Static files middleware options
 */
export declare class StaticFilesOptions {

    /**
     * Get or set the public folder. Default is "public"
     */
    public publicFolder: string;

    /**
     * Get or set the file extensions. If empty, the middleware will serve all files.
     */
    public fileExtensions: string[];
}
```

### Classes

```typescript
/**
 * Middleware to serve static files.
 */
export declare class StaticFilesMiddleware implements IMiddleware {
    /**
     * The name of the middleware.
     */
    public name: string;

    /**
     * The version of the middleware.
     */
    public version: string;

    /**
     * The folder that contains the static files.
     */
    public publicFolder: string;

    /**
     * Creates a new instance of the StaticFilesMiddleware class.
     * @param publicFolder The folder that contains the static files. Default is "public".
     */
    public constructor(publicFolder: string);

    /**
     * Handles the request to serve the static files.
     * @param httpContext The HTTP context.
     * @param next The next middleware
     * @returns A promise that represents the asynchronous operation.
     */
    public onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void>;
}
```