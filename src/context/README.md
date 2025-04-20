# @contextjs/context

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/context?cache=300)](https://www.npmjs.com/package/@contextjs/context)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Official CLI for building and managing ContextJS projects.

## ✨ Features

- Unified command-line interface for managing ContextJS-based projects  
- Support for creating new projects from templates  
- Project-wide or selective build and watch support  
- Supports all TypeScript compiler flags via `ctx build` and `ctx watch`  
- Supports custom and external transformers via `--transformers` or `context.ctxp`  
- Works seamlessly with all ContextJS packages  

## 📦 Installation

Install globally via npm:

```bash
npm install -g @contextjs/context
```

This exposes the `ctx` command globally in your terminal.

## 🚀 Usage

### Displaying available options

```bash
ctx
```

### Version

```bash
ctx version
```

### New project

These commands are equivalent:

```bash
ctx new api myApi
ctx new api -n myApi
ctx new api --name myApi
```

If no argument is passed for the API name, the current folder name will be used:

```bash
ctx new api
```

If no arguments are passed at all, the help message will be shown:

```bash
ctx new
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

Use a custom transformer:

```bash
ctx build --transformers=./src/my-transformer.ts
```

Or define transformers in `context.ctxp`:

```json
{
  "compilerOptions": {
    "transformers": ["./src/my-transformer.ts"]
  }
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

You can also include TypeScript flags with `watch`:

```bash
ctx watch --moduleResolution NodeNext --strict true
```

External transformers are also supported in watch mode:

```bash
ctx watch --transformers=./src/my-transformer.ts
```

## 📁 Project Structure

When you create a new project using `ctx new api myApi`, the following layout is generated:

```
myApi/
├── context.ctxp
├── tsconfig.json
├── package.json
└── src/
    └── main.ts
```

Each file is preconfigured to follow ContextJS conventions and integrates cleanly with the rest of the ecosystem.