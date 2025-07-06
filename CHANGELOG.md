# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [25.1.0] - 2025-07-06

### Added
- **@contextjs/templates**: New package for project templates, including a CLI for generating projects from templates.
- **@contextjs/commands**: New package for command-line interface (CLI) commands

## [25.0.0] - 2025-06-22

### Added

- Initial public release of the ContextJS.
- Includes the following packages:

| Package | Description |
| ------- | ----------- |
| **@contextjs/collections** | Generic data structures such as Dictionary, List, Queue, and Stack. |
| **@contextjs/configuration** | Configuration abstraction, including runtime config loading and providers. |
| **@contextjs/configuration-json** | JSON configuration provider that loads environment-aware settings with fallback support. |
| **@contextjs/context** | Main entrypoint for CLI, project scaffolding, and extension management. |
| **@contextjs/di** | Type-safe dependency injection, lifetimes, and service collections. |
| **@contextjs/io** | File, directory, and path utilities, plus robust exceptions for I/O. |
| **@contextjs/routing** | Route parsing, scoring, and route info structures. |
| **@contextjs/system** | Core utilities: exception hierarchy, console, extensions, and versioning. |
| **@contextjs/text** | String manipulation, formatters, and builders. |
| **@contextjs/webserver** | High-performance HTTP/2 server, context objects, and webserver options. |
| **@contextjs/webserver-middleware-controllers** | Controllers middleware for the ContextJS webserver. |
| **@contextjs/webserver-middleware-cookies** | Middleware for ContextJS WebServer that transparently handles HTTP cookies in requests and responses. |
| **@contextjs/webserver-middleware-static** | Middleware for ContextJS WebServer that serves static files. |

- 100% test coverage for all published packages.
- Documentation and API reference for each package.
- Full GitHub Actions CI/CD and automated release workflow.

[25.0.0]: https://github.com/contextjs/context/releases/tag/25.0.0
[25.1.0]: https://github.com/contextjs/context/releases/tag/25.1.0