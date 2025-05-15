# @contextjs/webserver

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/webserver?cache=300)](https://www.npmjs.com/package/@contextjs/webserver)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> High-performance, TypeScript-first HTTP/HTTPS server built directly on raw TCP sockets for maximum throughput, and zero runtime dependencies. Supports HTTP/2 with automatic HTTP/1.1 fallback, pooled contexts for minimal GC, and a robust middleware pipeline.

Designed to integrate seamlessly into the ContextJS ecosystem or run standalone.

## Table of Contents

1. [Installation](#installation)  
2. [Features](#features) 
3. [Benchmarks](#benchmarks)  
   - [Summary](#summary)  
   - [Extended Metrics](#extended-metrics)
4. [Quick Start](#quick-start)  
   - [Standalone Usage](#standalone-usage)  
   - [Application Integration](#application-integration)  
5. [Basic Middleware Example](#basic-middleware-example)  
6. [Streaming a File](#streaming-a-file)  
7. [Configuration Reference](#configuration-reference)  
8. [API Reference](#api-reference)  
9. [Events](#events)  
10. [Exceptions](#exceptions)  

## Installation

```bash
npm i @contextjs/webserver
```

## Features

- **Socket-based core** leveraging raw TCP sockets for lowest-level performance  
- **HTTP and HTTPS support** with PEM-encoded certificates  
- **Middleware pipeline** for modular request handling  
- **Context pooling** for reusing `HttpContext` instances  
- **Configurable header limits** and **idle socket cleanup**  
- **Lifecycle events** (`info`, `warning`, `error`) for observability  
- **TypeScript declarations** with full JSDoc support  
- **Zero dependencies** for maximum performance and minimal footprint

## Benchmarks

> Below are the results of our WebServer benchmark suite, which compares throughput and latency across four different Node.js–based HTTP servers. Each test is run on GitHub Actions' provided "ubuntu-latest" runner. The benchmarks target a minimal server that responds with a 200 OK status and a short body of "OK" They use **500 concurrent connections**, a **pipelining factor of 1**, and run for **10 seconds**, with a warmup phase, and results averaged over three runs.

### Summary
<!-- BENCHMARKS_SUMMARY:START -->
| Server | Req/sec | Latency (ms) | Throughput (MB/s) | Errors |
|--------|--------:|-------------:|------------------:|-------:|
| ContextJS | 14985.07 | 33.09 | 2.67 | 0.00 |
| Node.js Raw HTTP | 12634.13 | 39.38 | 2.25 | 0.00 |
| Fastify | 12093.87 | 41.18 | 2.16 | 0.00 |
| Express | 5244.80 | 87.21 | 1.26 | 44.33 |

<!-- BENCHMARKS_SUMMARY:END -->
**Column descriptions**:

- **Req/sec** — Average number of HTTP requests served per second.  
- **Latency (ms)** — Median (50th percentile) response time in milliseconds.  
- **Throughput (MB/s)** — Average data transferred per second.  
- **Errors** — Total connection-level failures (e.g. resets, refusals).

### Extended Metrics
<!-- BENCHMARKS_EXTENDED:START -->
| Server | Connections | Pipelining | Duration (s) | Latency Stdev (ms) | Requests Stdev | Throughput Stdev (MB/s) | Total Requests |
|--------|------------:|-----------:|-------------:|-------------------:|---------------:|------------------------:|----:|
| ContextJS | 500 | 1 | 10.11 | 108.78 | 239.53 | 0.04 | 449500 |
| Node.js Raw HTTP | 500 | 1 | 10.14 | 136.63 | 284.18 | 0.05 | 379000 |
| Fastify | 500 | 1 | 10.13 | 148.95 | 230.32 | 0.04 | 362750 |
| Express | 500 | 1 | 10.23 | 413.45 | 187.49 | 0.04 | 157318 |

<!-- BENCHMARKS_EXTENDED:END -->
**Extended column descriptions**:

- **Connections** — Number of simultaneous TCP connections opened.  
- **Pipelining** — Number of requests pipelined per connection.  
- **Duration (s)** — Total benchmark runtime in seconds.  
- **Latency Stdev (ms)** — Standard deviation of response latency.  
- **Requests Stdev** — Standard deviation of the requests/sec across samples.  
- **Throughput Stdev (MB/s)** — Standard deviation of throughput.  
- **Total Requests** — Sum of all successful 2xx responses across all iterations.

## Quick Start

### Standalone Usage

```ts
import { WebServer, WebServerOptions, GeneralWebServerOptions, HttpWebServerOptions } from "@contextjs/webserver";

const options = new WebServerOptions(
  new GeneralWebServerOptions(8192, 50, 30_000),
  new HttpWebServerOptions(true, "0.0.0.0", 3000, 60_000)
);

const server = new WebServer(options);

// Simple GET handler middleware
server.useMiddleware({
  name: "hello-world",
  async onRequest(ctx, next) {
    const { request, response } = ctx;
    if (request.path === "/" && request.method === "GET") {
      await response
        .setStatus(200)
        .setHeader("Content-Type", "text/plain; charset=utf-8")
        .sendAsync("Hello, ContextJS!");
      return;
    }
    await next();
  }
});

await server.startAsync();
console.log("Server listening on port 3000");
```

### Application Integration

If you’re using the ContextJS `Application` from `@contextjs/system`, you can wire up the server directly:

```ts
import { Application } from "@contextjs/system";
import "@contextjs/webserver"; // module augmentation

const app = new Application();

app.useWebServer(options => {
  options.http.port = 8080;
  options.onEvent = e => console.log(`[WebServer:${e.type}]`, e.detail);
});

app.webServer.useMiddleware({
    name: "logger",
    onRequest(ctx, next) {
      console.log(`${ctx.request.method} ${ctx.request.path}`);
      return next?.();
    }
});

await app.runAsync();
```

### Basic Middleware Example

```ts
server.useMiddleware({
  name: "json-parser",
  async onRequest(ctx, next) {
    const ct = ctx.request.headers.get("content-type");
    if (ctx.request.method === "POST" && ct === "application/json") {
      const chunks: Buffer[] = [];
      ctx.request.on("data", chunk => chunks.push(chunk));
      await new Promise(resolve => ctx.request.on("end", resolve));
      const body = JSON.parse(Buffer.concat(chunks).toString());
      ctx.request.parsedBody = body;
    }
    await next?.();
  }
});
```

### Streaming a File

```ts
import { createReadStream } from "fs";
import path from "path";

server.useMiddleware({
  name: "static-file",
  async onRequest(ctx, next) {
    if (ctx.request.path.startsWith("/assets/")) {
      const filePath = path.join(__dirname, ctx.request.path);
      await ctx.response
        .setHeader("Content-Type", "application/octet-stream")
        .streamAsync(createReadStream(filePath));
      return;
    }
    await next?.();
  }
});
```

## Configuration Reference

### `WebServerOptions`

| Property | Type                         | Description                                                  |
| -------- | ---------------------------- | ------------------------------------------------------------ |
| `general`| `GeneralWebServerOptions`    | Header limits, pool size, idle socket timeout                |
| `http`   | `HttpWebServerOptions`       | HTTP binding: port, host, keep-alive                         |
| `https`  | `HttpsWebServerOptions`      | HTTPS binding: port, host, keep-alive, SSL certificate       |
| `onEvent`| `(event: WebServerEvent)`    | Callback for `info` / `warning` / `error` events             |

### `GeneralWebServerOptions`

- `maximumHeaderSize: number` — max header bytes (default: 32 * 1024)  
- `httpContextPoolSize: number` — pre-allocate contexts (default: 1024)  
- `idleSocketsTimeout: number` — ms before closing idle sockets (default: 5000)  

### `HttpWebServerOptions`

- `enabled: boolean` — enable HTTP (default: true)  
- `host?: string` — bind address (default: "localhost")  
- `port: number` — port number (default: 80)  
- `keepAliveTimeout: number` — ms for connection keep-alive (default: 5000)  

### `HttpsWebServerOptions`

- `enabled: boolean` — enable HTTPS (default: false)  
- `host?: string` — bind address (default: "localhost")  
- `port: number` — port number (default: 443)  
- `certificate: { key: string; cert: string }` — PEM key & cert  
- `keepAliveTimeout: number` — ms for connection keep-alive (default: 5000)  


## API Reference

```ts
/**
 * Augment the base Application to integrate ContextJS WebServer.
 */
declare module "@contextjs/system" {
    export interface Application {
        /**
         * Configure and attach a WebServer to the application.
         * @param options Callback to configure WebServerOptions.
         * @returns The Application instance for chaining.
         */
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;
        /**
         * The active WebServer instance attached to the application.
         */
        webServer: WebServer;
    }
}

/**
 * Core HTTP/HTTPS server for handling requests and middleware pipeline.
 */
export declare class WebServer {
    /**
     * Create a new WebServer with the given configuration options.
     * @param options The WebServerOptions to apply settings and certificates.
     */
    public constructor(options: WebServerOptions);

    /**
     * Register a middleware component to be invoked on each request.
     * @param middleware The middleware implementation.
     * @returns The WebServer instance for chaining.
     */
    public useMiddleware(middleware: IMiddleware): this;

    /**
     * Start listening for connections based on configured HTTP/HTTPS options.
     */
    public startAsync(): Promise<void>;

    /**
     * Stop the server, waiting for active connections to close.
     */
    public stopAsync(): Promise<void>;

    /**
     * Restart the server by stopping and then starting again.
     */
    public restartAsync(): Promise<void>;
}

/**
 * Configuration root for WebServer, including general, HTTP, HTTPS, and event callbacks.
 */
export declare class WebServerOptions {
    /**
     * Reference to the associated WebServer instance.
     */
    public webServer: WebServer;
    /**
     * General settings affecting header sizes, pooling, and timeouts.
     */
    public general: GeneralWebServerOptions;
    /**
     * HTTP-specific network settings.
     */
    public http: HttpWebServerOptions;
    /**
     * HTTPS-specific network settings and SSL certificate.
     */
    public https: HttpsWebServerOptions;
    /**
     * Callback invoked for informational, warning, and error events.
     */
    public onEvent: (event: WebServerEvent) => void;

    /**
     * Initialize WebServerOptions with optional sub-settings and event handler.
     * @param general GeneralWebServerOptions overrides.
     * @param http HttpWebServerOptions overrides.
     * @param https HttpsWebServerOptions overrides.
     * @param onEvent Event callback for server lifecycle events.
     */
    public constructor(
        general?: GeneralWebServerOptions,
        http?: HttpWebServerOptions,
        https?: HttpsWebServerOptions,
        onEvent?: (event: WebServerEvent) => void);
}

/**
 * General configuration options for max header size, context pool, and idle socket cleanup.
 */
export declare class GeneralWebServerOptions {
    /**
     * Maximum size (bytes) allowed for incoming request headers.
     */
    public maximumHeaderSize: number;
    /**
     * Number of pre-allocated HttpContext objects in the pool.
     */
    public httpContextPoolSize: number;
    /**
     * Time (ms) after which idle sockets are closed.
     */
    public idleSocketsTimeout: number;

    /**
     * Create general server settings.
     * @param maximumHeaderSize Maximum header byte length.
     * @param httpContextPoolSize Number of contexts to pool.
     * @param idleSocketsTimeout Idle socket timeout in milliseconds.
     */
    public constructor(maximumHeaderSize?: number, httpContextPoolSize?: number, idleSocketsTimeout?: number);
}

/**
 * Base class for HTTP and HTTPS endpoint settings.
 */
export declare class WebServerOptionsBase {
    /**
     * Whether this protocol (HTTP/HTTPS) is enabled.
     */
    public enabled: boolean;
    /**
     * Port number to bind the server socket.
     */
    public port: number;
    /**
     * Optional hostname or IP address to bind.
     */
    public host?: string;
    /**
     * Keep-alive timeout (ms) for persistent connections.
     */
    public keepAliveTimeout: number;
}

/**
 * HTTP-specific network settings.
 */
export declare class HttpWebServerOptions extends WebServerOptionsBase {
    /**
     * Construct HTTP settings with defaults or overrides.
     * @param enabled Toggle HTTP support (default: true).
     * @param host Bind address (default: "localhost").
     * @param port Port number (default: 80).
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(enabled?: boolean, host?: string, port?: number, keepAliveTimeout?: number);
}

/**
 * HTTPS-specific network settings, including SSL certificate.
 */
export declare class HttpsWebServerOptions extends WebServerOptionsBase {
    /**
     * SSL certificate key and chain for encrypted connections.
     */
    public certificate: SSLCertificate;

    /**
     * Construct HTTPS settings with optional SSL certificate and overrides.
     * @param enabled Toggle HTTPS support (default: false).
     * @param host Bind address (default: "localhost").
     * @param port Port number (default: 443).
     * @param certificate SSL key and cert strings.
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(
        enabled?: boolean,
        host?: string,
        port?: number,
        certificate?: SSLCertificate,
        keepAliveTimeout?: number);
}

/**
 * SSL certificate definition for TLS handshake.
 */
export declare type SSLCertificate = {
    /**
     * PEM-encoded private key.
     */
    key: string;
    /**
     * PEM-encoded certificate chain.
     */
    cert: string;
};

/**
 * Middleware implementation to handle request lifecycle events.
 */
export declare interface IMiddleware {
    /**
     * Unique name of the middleware.
     */
    name: string;
    /**
     * Optional semantic version for ordering or compatibility.
     */
    version?: string;

    /**
     * Handler invoked for each incoming HTTP context.
     * @param httpContext The active request/response context.
     * @param next Optional continuation callback to invoke next middleware.
     */
    onRequest(httpContext: HttpContext, next?: () => Promise<void> | void): Promise<void> | void;
}
```

### Classes

```ts
/**
 * Events emitted by the WebServer during operation.
 */
export type WebServerEvent =
    | { type: "info"; detail: unknown }
    | { type: "warning"; detail: unknown }
    | { type: "error"; detail: unknown };

/**
 * Collection of HTTP headers with case-insensitive lookups.
 */
export declare class HeaderCollection {
    /**
     * Get the header value for the given name.
     * @param name Header name (case-insensitive).
     * @returns The header value or undefined if not present.
     */
    public get(name: string): string | undefined;

    /**
     * Set a header value, overwriting existing values.
     * @param name Header name.
     * @param value Header value string.
     */
    public set(name: string, value: string): void;

    /**
     * Determine if a header exists.
     * @param name Header name.
     */
    public has(name: string): boolean;

    /**
     * Iterate over normalized header entries as [name, value].
     */
    public entries(): IterableIterator<[string, string]>;

    /**
     * Iterate over original header entries preserving casing.
     */
    public originalEntries(): IterableIterator<[string, string]>;

    /**
     * Iterate over values with both original name and value.
     */
    public values(): IterableIterator<{ originalName: string; value: string }>;

    /**
     * Remove all headers from the collection.
     */
    public clear(): void;
}

/**
 * Request summary exposing method, path, and headers.
 */
export declare class Request {
    /**
     * HTTP method (GET, POST, etc.).
     */
    public readonly method: string;

    /**
     * URL path of the request.
     */
    public readonly path: string;

    /**
     * Parsed request headers.
     */
    public readonly headers: HeaderCollection;
}

/**
 * Response builder for status, headers, and payload.
 */
export declare class Response {
    /**
     * Modifiable collection of response headers.
     */
    public headers: HeaderCollection;

    /**
     * HTTP status code to send (e.g., 200, 404).
     */
    public statusCode: number;

    /**
     * HTTP status message corresponding to the status code.
     */
    public statusMessage: string;

    /**
     * Set status code and optional reason phrase.
     * @param code Numeric HTTP status code.
     * @param message Optional reason phrase (default from code).
     * @returns The Response instance for chaining.
     */
    public setStatus(code: number, message?: string): this;

    /**
     * Add or override a header on the response.
     * @param nameHeader name of the response header.
     * @param value Header value(s), joined if array.
     * @returns The Response instance for chaining.
     */
    public setHeader(name: string, value: string | number | string[]): this;

    /**
     * Send a complete body as Buffer or string and close connection.
     * @param body Payload to send.
     */
    public sendAsync(body: Buffer | string): Promise<void>;

    /**
     * Stream a readable stream directly to the client.
     * @param stream Node.js Readable stream.
     */
    public streamAsync(stream: NodeJS.ReadableStream): Promise<void>;
}

/**
 * Combined HTTP context providing request and response objects.
 */
export declare class HttpContext {
    /**
     * Parsed incoming request information.
     */
    public readonly request: Request;

    /**
     * Response builder for sending data.
     */
    public readonly response: Response;
}
```

### Exceptions

```ts
/**
 * Base exception type for WebServer errors.
 */
export declare class WebServerException extends SystemException {
    /**
     * Create a WebServerException for general errors.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown after a response has already been sent.
 */
export declare class ResponseSentException extends WebServerException {
    /**
     * Create a ResponseSentException when attempting additional operations after send.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when the HTTP context pool is exhausted or invalid.
 */
export declare class HttpContextPoolException extends WebServerException {
    /**
     * Create an exception for context pooling failures.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Generic middleware error during request processing.
 */
export declare class MiddlewareException extends WebServerException {
    /**
     * Create a MiddlewareException for errors in middleware logic.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when attempting to register middleware with a duplicate name.
 */
export declare class MiddlewareExistsException extends WebServerException {
    /**
     * Create an exception indicating the middleware name conflict.
     * @param name Name of the middleware that already exists.
     * @param options Standard ErrorOptions.
     */
    public constructor(name: string, options?: ErrorOptions);
}

/**
 * Thrown when an SSL certificate key is missing or invalid.
 */
export declare class InvalidCertificateKeyException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL key.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}

/**
 * Thrown when an SSL certificate chain is missing or invalid.
 */
export declare class InvalidCertificateException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL certificate.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}
```

## Events

The server emits runtime events via the `onEvent` callback:

- **`info`** — general progress messages  
- **`warning`** — recoverable issues (e.g. idle socket timeout)  
- **`error`** — fatal or unexpected errors  