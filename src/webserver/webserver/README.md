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
| ContextJS | 14134.40 | 35.16 | 2.52 | 0.00 |
| Node.js Raw HTTP | 11993.33 | 41.55 | 2.14 | 0.00 |
| Fastify | 11418.13 | 43.67 | 2.04 | 0.00 |
| Express | 5145.87 | 88.34 | 1.23 | 49.33 |

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
| ContextJS | 500 | 1 | 10.12 | 118.75 | 172.15 | 0.03 | 424000 |
| Node.js Raw HTTP | 500 | 1 | 10.15 | 150.74 | 187.01 | 0.03 | 359750 |
| Fastify | 500 | 1 | 10.12 | 163.87 | 168.70 | 0.03 | 342500 |
| Express | 500 | 1 | 10.22 | 418.75 | 161.43 | 0.04 | 154354 |

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

```typescript
import { HttpContext, HttpWebServerOptions, WebServer, WebServerOptions } from "@contextjs/webserver";

const options = new WebServerOptions(
    undefined,
    new HttpWebServerOptions(true, "0.0.0.0", 3000, 60_000)
);

const server = new WebServer(options);

// Simple middleware
server.useMiddleware({
    name: "hello-world",
    async onRequest(context: HttpContext) {
        await context.response
            .setHeader("Content-Type", "text/plain")
            .sendAsync("Hello, ContextJS!");
    }
});

server.startAsync()

setTimeout(async () => {
    await server.stopAsync();
    console.log("Server stopped after 60 seconds");
}, 60000);
```

### Application Integration

If you’re using the ContextJS `Application` from `@contextjs/system`, you can wire up the server directly:

```typescript
import "@contextjs/webserver"; // module augmentation
import { Application } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";

const app = new Application();

app.useWebServer(options => {
    options.http.port = 8080;
    options.onEvent = e => console.log(`[WebServer:${e.type}]`, e.detail);
});

app.webServer.useMiddleware({
    name: "logger",
    version: "1.0.0",
    onRequest(context: HttpContext) {
        console.log(`${context.request.method} ${context.request.path}`);
        context.response
            .setHeader("Content-Type", "text/plain")
            .setHeader("X-ContextJS", "Hello World")
            .sendAsync("Hello, ContextJS!");
    }
});

await app.runAsync();
```

### Streaming a File

```typescript
app.webServer.useMiddleware({
    name: "static-file",
    version: "1.0.0",
    async onRequest(context: HttpContext, next: () => Promise<void>) {
        if (context.request.path.startsWith("/assets/")) {
            const filePath = path.join(__dirname, context.request.path);
            return await context.response
                .setHeader("Content-Type", "application/octet-stream")
                .streamAsync(createReadStream(filePath));
        }
        await next();
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
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/webserver#api-reference).

## Events

The server emits runtime events via the `onEvent` callback:

- **`info`** — general progress messages  
- **`warning`** — recoverable issues (e.g. idle socket timeout)  
- **`error`** — fatal or unexpected errors  