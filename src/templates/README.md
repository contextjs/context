# @contextjs/templates

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/templates?cache=300)](https://www.npmjs.com/package/@contextjs/templates)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Official project templates for ContextJS.

## Overview

This package provides all **official project templates** for the ContextJS ecosystem.  
Templates are discovered and used automatically by the [`@contextjs/context`](https://www.npmjs.com/package/@contextjs/context) CLI when installed globally.

- **Not a standalone CLI.**
- No direct API surface; it’s consumed by the main ContextJS CLI.

---

## Usage

To use these templates, install both `@contextjs/context` and `@contextjs/templates` globally:

```bash
npm install -g @contextjs/context @contextjs/templates
```

Then run:

```bash
ctx new
```

You will see all available official templates, and can scaffold projects directly from them.

## Example

To create a new Web API project:

```bash
ctx new webapi myapi
```

To see all templates:

```bash
ctx new
```

## Available Templates

The following templates are included (the actual list may change with each release):

- **webapi** – REST API starter

Each template includes:
- Standard project structure
- Preconfigured ContextJS settings
- Example source files

## How It Works

When `@contextjs/templates` is installed globally,  
the `@contextjs/context` CLI will automatically detect and list all included templates when you run `ctx new`.

- **You do not invoke this package directly.**
- Removing this package will remove access to official templates in the CLI.