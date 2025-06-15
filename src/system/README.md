# @contextjs/system

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/system?cache=300)](https://www.npmjs.com/package/@contextjs/system)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> A zero-dependency system utility library for the ContextJS ecosystem, providing application lifecycle, environment detection, console formatting, exception handling, property extraction (`nameof()`), and core extensions — all written with full type safety.

## Features

- **Application lifecycle management** with `onRun()` hooks
- **Environment detection** with development/production/test/staging support
- **Console formatting** with ANSI styles and argument parsing
- **Typed exceptions** like `NullReferenceException` and `InvalidExpressionException`
- **Safe property extraction** via `nameof()` for both lambdas and keys
- **Core helpers** for object and string manipulation with type guards
- **Type-safe utility `Throw` guard methods**
- **Fully tested**, 100% coverage, no dependencies

## Installation

```bash
npm i @contextjs/system
```

## Quick Start

### 1. Run an application

```typescript
import { Application } from '@contextjs/system';

const app = new Application();

app.onRun(async () => {
    console.log("App booted");
});

await app.runAsync();
```

### 2. nameof() Example

```typescript
import { Application, nameof } from '@contextjs/system';

const app = new Application();

class User {
    name: string = 'John Doe';
    age: number = 30;
}

class Config {
    port: number = 3000;
    host: string = 'localhost';
}

const user = new User();

const property = nameof(() => user.name); // "name"
const key = nameof<Config>('port');       // "port"

app.onRun(async () => {
    console.log("App is running");
    console.log(`User name: ${user.name}`);
    console.log(`User age: ${user.age}`);
});

await app.runAsync();
```
## Console Formatting

```typescript
import { Console } from "@contextjs/system";

Console.writeLineSuccess('✔ Success');
Console.writeLineWarning('⚠ Warning');
Console.writeLineError('✖ Error');
Console.writeLineInfo('ℹ Info');

Console.writeLineFormatted({ format: ['bold', 'green'], text: 'Styled' });
```

## Common Utilities

### Guard with `Throw`

```typescript
import { Application, StringExtensions, Throw } from "@contextjs/system";

const name = StringExtensions.empty;
const configPath = "config.json";
const obj = { key: "value" };

const app = new Application();

app.onRun(async () => {
    Throw.ifNullOrWhiteSpace(name);
    Throw.ifNullOrEmpty(configPath);
    Throw.ifNull(obj);
});

await app.runAsync();
```

### Use string helpers

```typescript
import { StringExtensions } from "@contextjs/system";

const value = "a b c ";

StringExtensions.removeWhiteSpaces(value);
console.log(StringExtensions.isNullOrWhitespace(value));
```

### Check object null state

```typescript
import { ObjectExtensions } from "@contextjs/system";

const value: string = "Hello, World!";

if (!ObjectExtensions.isNullOrUndefined(value)) {
    // TypeScript will narrow the type
    console.log(value);
}
```

## Testing

This library is fully covered with unit tests using Node's native `test` module.

Test coverage includes:
- Environment parsing
- Console formatting
- String/object helpers
- Exception and guard behavior
- Version display
- Application lifecycle execution
- Property name extraction via `nameof()`

## Philosophy

@contextjs/system is built to be the minimal core foundation for higher-level libraries in the ContextJS ecosystem.
It provides safe, strongly-typed primitives that you can rely on without reflection, decorators, or external dependencies.

## API Reference
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/system#api-reference).