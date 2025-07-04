# @contextjs/commands

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/commands?cache=300)](https://www.npmjs.com/package/@contextjs/commands)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Core command implementations for building, restoring, running, and watching ContextJS projects.

## Features

- Build, restore, run, and watch ContextJS projects via CLI commands
- Full support for TypeScript compiler flags and project selection
- Custom transformers and extensions support
- Consistent project discovery and error handling
- Seamless integration with all ContextJS tools

## Installation

Usually installed as a dependency and used internally.  
For advanced or direct usage:

```bash
npm install --save-dev @contextjs/commands
```

## Commands

### build

Compiles the project TypeScript sources and prepares templates for deployment.

```
ctx build
```

- **Description:** Compiles the ContextJS project(s) using the project file and `tsconfig.json`.
- **Options:** Accepts any TypeScript compiler flag, project selectors, and custom extensions.

### restore

Restores all NPM dependencies for each detected ContextJS project.

```
ctx restore
```

- **Description:** Installs or updates dependencies based on each project’s `package.json`.
- **Behavior:** Fails if either `context.ctxp` or `tsconfig.json` are missing.

### run

Executes the main entry point of a built ContextJS project.

```
ctx run
```

- **Description:** Finds and runs the compiled output specified in the project manifest.
- **Options:** Can be chained with build (default) or use `--no-build` to skip rebuilding.

### watch

Starts a file watcher for each ContextJS project and automatically recompiles on changes.

```
ctx watch
```

- **Description:** Watches sources and rebuilds on changes, using TypeScript's watch API.
- **Options:** All TypeScript CLI flags, transformer support, and project filtering.

## Usage Examples

```bash
ctx build                 # Build all projects
ctx restore               # Restore dependencies
ctx run                   # Build and run (default), or use --no-build
ctx watch                 # Watch files and auto-build
```

With project selection:

```bash
ctx build myApi myWeb     # Only build specific projects
```

With TypeScript options:

```bash
ctx build --noEmitOnError --target ES2022
ctx watch --strict true
```

With custom extensions:

```bash
ctx build --extensions=./src/my-extension.js
ctx watch --extensions=./src/my-extension.js
```