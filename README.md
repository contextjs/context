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
| [`@contextjs/webserver-middleware-static`](https://github.com/contextjs/context/tree/main/src/webserver/webserver-middleware-static) | Static files middleware for the ContextJS web server |

## Ecosystem Principles

- **Modular structure**: All packages expose public APIs via `api/index.ts`
- **Test coverage**: 100% unit test coverage enforced across all packages (`node:test`)
- **Test design**: Structured by class/method using `context.assert`
- **Documentation**: All modules include clean README files with badges, usage, and API references
- **Extensibility**: Compiler and CLI support transformers and extensions (internal and external)
- **Transformers**: Auto-discovered from `.transformers/` folders and injected at compile time

> All packages follow [MIT](https://github.com/contextjs/context/blob/main/LICENSE) licensing and are actively maintained under the [ContextJS GitHub organization](https://github.com/contextjs/context).

## WebServer Benchmarks

<!-- BENCHMARKS:START -->


### Summary
| Server | Req/sec | Latency (ms) | Throughput (MB/s) | Errors |
|--------|---------|--------------|-------------------|--------|
| ContextJS | 13980.27 | 51.42 | 2.49 | 266.33 |
| Node.js Raw HTTP | 11673.87 | 56.45 | 2.08 | 341 |
| Fastify | 10930.67 | 58.38 | 1.95 | 362 |
| Express | 4668.9 | 91.17 | 1.12 | 576 |


### Extended Metrics
| Server | Connections | Pipelining | Duration (s) | Latency Stdev (ms) | Requests Stdev | Throughput Stdev (MB/s) | Total Requests |
|--------|-------------|------------|--------------|--------------------|----------------|-------------------------|-----|
| ContextJS | 1000 | 1 | 10.16 | 341.65 | 448.56 | 0.08 | 419389 |
| Node.js Raw HTTP | 1000 | 1 | 10.17 | 358.7 | 412.94 | 0.07 | 350199 |
| Fastify | 1000 | 1 | 10.18 | 362.45 | 332.79 | 0.06 | 327898 |
| Express | 1000 | 1 | 10.18 | 468.42 | 1466.14 | 0.35 | 140049 |

<!-- BENCHMARKS:END -->