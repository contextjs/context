# @contextjs/context

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/context?cache=300)](https://www.npmjs.com/package/@contextjs/context)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Official CLI for building and managing ContextJS projects.

## ✨ Features

- Unified command-line interface for managing ContextJS-based projects
- Support for creating new projects from templates
- Project-wide or selective build and watch support
- Simple interface with intelligent defaults
- Works seamlessly with all ContextJS packages

## 📦 Installation

Install globally via npm:

```bash
npm install -g @contextjs/context
```

This will expose the `ctx` command globally in your terminal.

## 🚀 Usage

### Displaying ContextJS options

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

If no argument is passed for API name, current folder name will be used:

```bash
ctx new api
```

If no argument is passed at all, the help will be displayed:

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

### Watch

Watch and rebuild all projects on file changes:

```bash
ctx watch
```

Watch specific projects:

```bash
ctx watch myApi1 myApi2 ...
```

## 📁 Project Structure

When you create a new project (e.g., `ctx new api myApi`), ContextJS generates:

```
myApi/
├── context.ctxp
├── tsconfig.json
├── package.json
└── src/
    └── main.ts
```

Each file is preconfigured to follow ContextJS conventions and integrate with the rest of the ecosystem.