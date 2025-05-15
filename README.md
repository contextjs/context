# ContextJS

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/context?cache=300)](https://www.npmjs.com/package/@contextjs/context)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

# Overview

> A modular, test-driven TypeScript ecosystem built on object-oriented design and zero-runtime dependencies.

#### 🚧 Status: Pre-release – APIs and internal structures are stable, but breaking changes may occur before 1.0

## Getting Started

Install the CLI globally:

```bash
npm i -g @contextjs/context
```

Create a new project:

```bash
ctx new api my-app
ctx build
```

## Core Packages

| Package | Description |
|--------|-------------|
| [`@contextjs/system`](https://github.com/contextjs/context/tree/main/src/system) | Foundation utilities: `Console`, `Exception`, `Throw`, `VersionService`, argument parsing, and string/object extensions |
| [`@contextjs/di`](https://github.com/contextjs/context/tree/main/src/di) | Dependency injection container with interface-based registration, constructor metadata via AST transformers, and scoped lifetimes |
| [`@contextjs/compiler`](https://github.com/contextjs/context/tree/main/src/compiler) | TypeScript build engine with transformer merging, diagnostic reporting, and extension-ready `build()` and `watch()` flows |
| [`@contextjs/context`](https://github.com/contextjs/context/tree/main/src/context) | Official CLI tool (`ctx`) for building, watching, scaffolding, and restoring projects; supports full TypeScript flag passthrough and custom transformers |

## Collections & IO

| Package | Description |
|--------|-------------|
| [`@contextjs/collections`](https://github.com/contextjs/context/tree/main/src/collections) | Generic, high-performance data structures: `List`, `Queue`, `Stack`, `Dictionary`, `HashSet` |
| [`@contextjs/io`](https://github.com/contextjs/context/tree/main/src/io) | Filesystem abstraction with `File`, `Directory`, async read/write, and path utilities |

## Text

| Package | Description |
|--------|-------------|
| [`@contextjs/text`](https://github.com/contextjs/context/tree/main/src/text) | String manipulation utilities, including a segment-based `StringBuilder` with fluent chaining, formatting, and cloning support |

## Configuration

| Package | Description |
|--------|-------------|
| [`@contextjs/configuration`](https://github.com/contextjs/context/tree/main/src/configuration) | Configuration abstraction layer with a unified provider interface |
| [`@contextjs/configuration-json`](https://github.com/contextjs/context/tree/main/src/configuration-json) | JSON configuration provider that loads environment-aware settings with fallback support |

## Routing

| Package | Description |
|--------|-------------|
| [`@contextjs/routing`](https://github.com/contextjs/context/tree/main/src/routing) | Advanced router supporting literal, parameter, optional, and wildcard segments with a scoring-based matcher |

## Web Server

| Package | Description |
|--------|-------------|
| [`@contextjs/webserver`](https://github.com/contextjs/context/tree/main/src/webserver/webserver) | High-performance, TypeScript-first HTTP/HTTPS server built directly on raw TCP sockets for maximum throughput, and zero runtime dependencies. Supports HTTP/2 with automatic HTTP/1.1 fallback, pooled contexts for minimal GC, and a robust middleware pipeline. |
| [`@contextjs/webserver-middleware-static`](https://github.com/contextjs/context/tree/main/src/webserver/webserver-middleware-static) | Static files middleware for the ContextJS WebServer |
| [`@contextjs/webserver-middleware-cookies`](https://github.com/contextjs/context/tree/main/src/webserver/webserver-middleware-cookies) | Middleware for ContextJS WebServer that transparently handles HTTP cookies in requests and responses. |

## Ecosystem Principles

- **Modular structure**: All packages expose public APIs via `api/index.ts`
- **Test coverage**: 100% unit test coverage enforced across all packages (`node:test`)
- **Test design**: Structured by class/method using `context.assert`
- **Documentation**: All modules include clean README files with badges, usage, and API references
- **Extensibility**: Compiler and CLI support transformers and extensions (internal and external)
- **Transformers**: Auto-discovered from `.transformers/` folders and injected at compile time

> All packages follow [MIT](https://github.com/contextjs/context/blob/main/LICENSE) licensing and are actively maintained under the [ContextJS GitHub organization](https://github.com/contextjs/context).

## WebServer Benchmarks

> Below are the results of our WebServer benchmark suite, which compares throughput and latency across four different Node.js–based HTTP servers. Each test is run on GitHub Actions' provided "ubuntu-latest" runner. The benchmarks target a minimal server that responds with a 200 OK status and a short body of "OK" They use **500 concurrent connections**, a **pipelining factor of 1**, and run for **10 seconds**, with a warmup phase, and results averaged over three runs.

### Summary
<!-- BENCHMARKS_SUMMARY:START -->
| Server | Req/sec | Latency (ms) | Throughput (MB/s) | Errors |
|--------|--------:|-------------:|------------------:|-------:|
| ContextJS | 12834.93 | 38.76 | 2.29 | 0.00 |
| Node.js Raw HTTP | 10842.40 | 46.11 | 1.93 | 0.00 |
| Fastify | 10142.94 | 49.15 | 1.81 | 0.00 |
| Express | 4702.14 | 92.21 | 1.13 | 68.67 |

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
| ContextJS | 500 | 1 | 10.10 | 135.97 | 157.69 | 0.03 | 385000 |
| Node.js Raw HTTP | 500 | 1 | 10.11 | 177.13 | 124.34 | 0.02 | 325250 |
| Fastify | 500 | 1 | 10.11 | 192.68 | 92.83 | 0.02 | 304250 |
| Express | 500 | 1 | 10.17 | 429.55 | 137.68 | 0.03 | 141046 |

<!-- BENCHMARKS_EXTENDED:END -->
**Extended column descriptions**:

- **Connections** — Number of simultaneous TCP connections opened.  
- **Pipelining** — Number of requests pipelined per connection.  
- **Duration (s)** — Total benchmark runtime in seconds.  
- **Latency Stdev (ms)** — Standard deviation of response latency.  
- **Requests Stdev** — Standard deviation of the requests/sec across samples.  
- **Throughput Stdev (MB/s)** — Standard deviation of throughput.  
- **Total Requests** — Sum of all successful 2xx responses across all iterations.