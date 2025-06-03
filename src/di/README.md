# @contextjs/di

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/di?cache=300)](https://www.npmjs.com/package/@contextjs/di)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> A TypeScript-first, object-oriented dependency injection container with interface support, zero decorators, and full transformer-based resolution.

## Features

- **Interface-based service registration** with generics
- **No decorators, no reflect-metadata**
- **Transformer-based constructor metadata extraction**
- **Singleton and transient lifetimes**
- **Full constructor injection, including primitives**
- **Runtime circular dependency detection**
- **Fallback to global constructors (`String`, `Number`, etc.)**
- **Scoped resolution support via `onResolve` hook**
- **Clean, extensible design** with 100% test coverage

---

## Installation

```bash
npm i @contextjs/di
```

---

## Quick Start

Jump to: [API Reference](#api-reference) • [Advanced Features](#advanced-features) • [Philosophy](#philosophy) • [Testing](#testing)

### 1. Define services
```typescript
interface ILogger {
    log(message: string): void;
}

class ConsoleLogger implements ILogger {
    log(message: string) {
        console.log('[LOG]', message);
    }
}
```

### 2. Register services
```typescript
import { ServiceCollection } from '@contextjs/di';

const services = new ServiceCollection();
services.addSingleton<ILogger, ConsoleLogger>();
```

### 3. Resolve services
```typescript
const logger = services.resolve<ILogger>();
logger?.log('Hello from DI!');
```

### 4. Use dependencies in Application
```typescript
import '@contextjs/di';
import { Application } from '@contextjs/system';

interface ILogger {
    log(message: string): void;
}

class ConsoleLogger implements ILogger {
    log(message: string) {
        console.log('[LOG]', message);
    }
}

const application = new Application();
application.useDependencyInjection();

application.services.addTransient<ILogger, ConsoleLogger>();


application.onRun(async () => {
    const logger = application.services.resolve<ILogger>();
    logger?.log('Application is running with dependency injection!');
});

await application.runAsync();
```

---

## Core Concepts

### Service Collection
Acts as the container that stores service registrations and resolves instances.

### Lifetimes
- **singleton**: One instance per container
- **transient**: A new instance per resolution

### Interface Support
The transformer compiles your registration call into metadata so that interfaces can be resolved automatically, with no need for runtime tokens or reflection.

---

## Advanced Features

### API with strong typing
```typescript
services.addSingleton<IInterface, Implementation>();
services.resolve<IInterface>();
```

### Circular Dependency Detection
Detects loops and throws a `CircularDependencyException` with a readable chain trace.

### Fallback Resolution
If a dependency isn't registered but exists on `globalThis` (e.g. `String`, `Number`), it will attempt to instantiate it directly.

### Hookable `onResolve`
Control resolution at runtime (e.g. for scoped or per-request lifetimes):
```typescript
services.onResolve = ({ name, lifetime, service }) => {
    if (lifetime === 'scoped') {
        return requestScope.getOrCreate(name, () => new service.type());
    }
    return null;
};
```

### Manual registration (optional)
```typescript
services.dependenciesAccessor.set('ILogger', {
    lifetime: 'singleton',
    type: ConsoleLogger,
    parameters: []
});
```

---

## Testing

This project maintains **100% test coverage** across:
- Constructor metadata parsing
- Singleton vs. transient lifetimes
- Circular reference handling
- `globalThis` fallback
- Interface registration
- `onResolve` overrides

---

## Philosophy

Many DI containers in the JS/TS ecosystem rely on decorators and metadata reflection. These approaches are fragile, hard to test, and incompatible with interface-based architecture.

`@contextjs/di` takes a different path:

- No decorators
- No `reflect-metadata`
- Full static type safety
- Zero runtime dependency metadata
- A container designed for OOP in TypeScript

---

## API Reference
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/di#api-reference).