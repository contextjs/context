# @contextjs/text

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/text?cache=300)](https://www.npmjs.com/package/@contextjs/text)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> String manipulation utilities for ContextJS applications

## Features

- Chainable, immutable-safe `StringBuilder` implementation
- Efficient string concatenation using segment arrays
- Support for insertion, removal, and replacement
- Fluent `appendFormat`, `appendLine`, `clear`, and `clone` methods
- Implicit string conversion with `Symbol.toPrimitive`
- Test-driven and zero-runtime dependency

## Installation

```bash
npm i @contextjs/text
```

## Usage Example

```typescript
import { StringBuilder } from "@contextjs/text";

const builder = new StringBuilder();

builder
    .append("Hello")
    .append(", ")
    .appendFormat("{0}!", "world");
    
console.log(builder.toString()); // "Hello, world!"
```

## API Reference
For detailed API documentation, please refer to <a href="https://contextjs.dev/api/text#api-reference" target="_blank" rel="noopener noreferrer">API Reference</a>
<span style="font-size:0.75em;vertical-align:super;">↗️</span>