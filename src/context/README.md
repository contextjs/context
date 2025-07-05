# @contextjs/context

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/context?cache=300)](https://www.npmjs.com/package/@contextjs/context)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Official CLI for building and managing ContextJS projects.

## Features

- Unified command-line interface for all ContextJS-based projects  
- Fast, extensible project build and watch support  
- Seamless integration with the ContextJS ecosystem  
- Full support for TypeScript compiler flags via `ctx build` and `ctx watch`  
- Support for custom compiler extensions via `--extensions` or `context.ctxp`  
- Easily scaffold new projects from official templates (see below)

## Installation

For the **full CLI experience, including templates**, install `@contextjs/context` and both `@contextjs/templates` and `@contextjs/commands` globally:

```bash
npm install -g @contextjs/context @contextjs/templates @contextjs/commands
```

This exposes the `ctx` command in your terminal, with official templates automatically discovered when you run `ctx new`, `ctx build`, `ctx watch`, etc.

> The `@contextjs/templates` and `@contextjs/commands` packages are separate so you can install only what you need: just the CLI, just the templates, or both. You can also install them locally in your project if you prefer not to install them globally.  
> You can also install third-party templates and commands to use, the ContextJS ecosystem is designed to be extensible.


## Usage

### Display help and available options

```bash
ctx
```

### Version

```bash
ctx --version
```

```bash
ctx -v
```

### New project (with templates)

> Requires `@contextjs/templates` installed globally.

```bash
ctx new webapi myApi
ctx new webapi -n myApi
ctx new webapi --name myApi
```

If no project name is provided, the current folder name will be used:

```bash
ctx new webapi
```

### Build

Build all detected projects:

```bash
ctx build
```

Build specific projects:

```bash
ctx build myApi1 myApi2 ...
```

You can pass TypeScript compiler options directly:

```bash
ctx build --noEmitOnError --target ES2022
```

Use a custom extension for the TypeScript compiler:

```bash
ctx build --extensions=./src/my-extension.ts
```

Or define extensions in `myapi.ctxp`:

```json
{
    "compilerExtensions": ["./src/my-extension.ts"]
}
```

### Watch

Watch and rebuild all projects on file changes:

```bash
ctx watch
```

Watch specific projects:

```bash
ctx watch myApi1 myApi2 ...
```

Include TypeScript flags with `watch`:

```bash
ctx watch --moduleResolution NodeNext --strict true
```

External extensions are supported in watch mode as well:

```bash
ctx watch --extensions=./src/my-extension.ts
```

## Project Templates

Templates are provided by the [`@contextjs/templates`](https://www.npmjs.com/package/@contextjs/templates) package.
- Install it globally to make all official templates available to the CLI.
- When you run `ctx new ...`, templates are automatically discovered and listed.

You can find a list of available templates in the [@contextjs/templates README](https://www.npmjs.com/package/@contextjs/templates).

## Project commands
- `ctx new <template> --name <projectName>`: Create a new project using the specified template.
- `ctx build [projectName1 projectName2 ...]`: Builds one or more projects
- `ctx watch [projectName1 projectName2 ...]`: Watches one or more projects for changes and rebuilds them automatically
- `ctx restore [projectName1 projectName2 ...]`: Restores the project dependencies and configurations
- `ctx run [projectName1 projectName2 ...]`: Runs the specified projects.
- `ctx --version`: Displays the current version of the CLI
- `ctx -v`: Alias for `--version`

## Project Structure

When you create a new project using `ctx new webapi myapi`, the following layout is generated:

```
myapi/
├── myapi.ctxp
├── tsconfig.json
├── package.json
└── src/
    └── main.ts
```

All files are preconfigured to follow ContextJS conventions and integrate cleanly with the rest of the ecosystem.