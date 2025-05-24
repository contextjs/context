# @contextjs/di

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/di?cache=300)](https://www.npmjs.com/package/@contextjs/di)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> A TypeScript-first, object-oriented dependency injection container with interface support, zero decorators, and full transformer-based resolution.

## ✨ Features

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

## 📦 Installation

```bash
npm i @contextjs/di
```

---

## 🚀 Quick Start

Jump to: [API Reference](#api-reference) • [Advanced Features](#advanced-features) • [Philosophy](#philosophy) • [Testing](#testing)

### 1. Define services
```ts
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
```ts
import { ServiceCollection } from '@contextjs/di';

const services = new ServiceCollection();
services.addSingleton<ILogger, ConsoleLogger>();
```

### 3. Resolve services
```ts
const logger = services.resolve<ILogger>();
logger?.log('Hello from DI!');
```

### 4. Inject dependencies
```ts
class App {
    constructor(private logger: ILogger, private version: String) {}

    run() {
        this.logger.log(`App version: ${this.version}`);
    }
}

services.addTransient<App>();
const app = services.resolve<App>();
app?.run();
```

---

## 🔍 Core Concepts

### Service Collection
Acts as the container that stores service registrations and resolves instances.

### Lifetimes
- **singleton**: One instance per container
- **transient**: A new instance per resolution

### Interface Support
The transformer compiles your registration call into metadata so that interfaces can be resolved automatically, with no need for runtime tokens or reflection.

---

## Advanced Features

### ✅ API with strong typing
```ts
services.addSingleton<IInterface, Implementation>();
services.resolve<IInterface>();
```

### 🔄 Circular Dependency Detection
Detects loops and throws a `CircularDependencyException` with a readable chain trace.

### 🌐 Fallback Resolution
If a dependency isn't registered but exists on `globalThis` (e.g. `String`, `Number`), it will attempt to instantiate it directly.

### 🧩 Hookable `onResolve`
Control resolution at runtime (e.g. for scoped or per-request lifetimes):
```ts
services.onResolve = ({ name, lifetime, service }) => {
    if (lifetime === 'scoped') {
        return requestScope.getOrCreate(name, () => new service.type());
    }
    return null;
};
```

### 🔧 Manual registration (optional)
```ts
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

### Extensions

```typescript
/**
 * Module that extends the Application class to include dependency injection capabilities.
 * This module provides methods for configuring and using dependency injection in the application.
 **/
declare module "@contextjs/system" {
    /**
     * Extends the Application class to include dependency injection capabilities.
     * 
     * @param options - A function that takes a DependencyInjectionOptions object to configure the dependency injection system.
     * @returns The current instance of the Application with dependency injection configured.
     */
    export interface Application {
        /**
         * Configures the dependency injection system for the application.
         * 
         * @param options - A function that takes a DependencyInjectionOptions object to configure the dependency injection system.
         * @returns The current instance of the Application with dependency injection configured.
         */
        useDependencyInjection(options?: (dependencyInjectionOptions: DependencyInjectionOptions) => void): Application;

        /**
         * The collection of services registered in the dependency injection system.
         * 
         * @type {ServiceCollection}
         */
        services: ServiceCollection;
    }
}

/**
* Class representing options for configuring the dependency injection system.
* This class allows customization of the dependency injection behavior, such as resolving dependencies and managing service lifetimes.
**/
export declare class DependencyInjectionOptions {
    public onResolve?: (context: {
        name: string;
        lifetime: ServiceLifetime;
        parameters: ConstructorParameter[];
        service: Service;
    }) => any | null;
}
```

### Classes

```typescript
/**
 * Class representing a constructor parameter.
 * This class is used to define the parameters of a constructor in a service, including their names and types.
 **/
export declare class ConstructorParameter {
    /**
     * The name of the parameter.
     * @type {string}
     */
    public readonly name: string;

    /**
     * The type of the parameter.
     * @type {any}
     */
    public readonly type: any;

    /**
     * Creates an instance of ConstructorParameter.
     * @param name - The name of the parameter.
     * @param type - The type of the parameter.
     **/
    public constructor(name: string, type: any);
}

/**
 * Represents a service lifetime in the dependency injection system.
 **/
export declare type ServiceLifetime = "singleton" | "transient";

/**
 * Class representing a service in the dependency injection system.
 * This class contains information about the service's lifetime, type, and constructor parameters.
 **/
export declare class Service {
    /**
     * The lifetime of the service.
     * @type {ServiceLifetime}
     */
    public readonly lifetime: ServiceLifetime;

    /**
     * The type of the service.
     * @type {any}
     */
    public readonly type: any;

    /**
     * The constructor parameters of the service.
     * @type {ConstructorParameter[]}
     */
    public readonly parameters: ConstructorParameter[];

    /**
     * Creates an instance of Service.
     * @param type - The type of the service.
     * @param lifetime - The lifetime of the service.
     * @param parameters - The constructor parameters of the service.
     **/
    public constructor(type: any, lifetime: ServiceLifetime, parameters: ConstructorParameter[]);
}
```

### Services

```typescript
/**
 * Class representing a collection of services in the dependency injection system.
 * This class provides methods for adding and resolving services, as well as managing their lifetimes.
 **/
export declare class ServiceCollection {
    /**
     * Creates an instance of ServiceCollection.
     **/
    public public constructor();

    /**
     * Adds a service to the collection with a singleton lifetime.
     * @type {TImplementation} - The implementation type of the service.
     **/
    public addSingleton<TImplementation>(): void;

    /**
     * Adds a service to the collection with a singleton lifetime.
     * @type {TInterface} - The interface type of the service.
     * @type {TImplementation} - The implementation type of the service.
     **/
    public addSingleton<TInterface, TImplementation>(): void;

    /**
     * Adds a service to the collection with a transient lifetime.
     * @type {TImplementation} - The implementation type of the service.
     **/
    public addTransient<TImplementation>(): void;

    /**
     * Adds a service to the collection with a transient lifetime.
     * @type {TInterface} - The interface type of the service.
     * @type {TImplementation} - The implementation type of the service.
     **/
    public addTransient<TInterface, TImplementation>(): void;

    /**
     * Resolves a service from the collection by its type
     * @type {T} - The type of the service to resolve.
     * @returns The resolved service instance, or null if not found.
     **/
    public resolve<T>(): T | null;

    /**
     * Resolves a service from the collection by its name.
     * @type {T} - The type of the service to resolve.
     * @param name - The name of the service to resolve.
     * @returns The resolved service instance, or null if not found.
     **/
    public resolve<T>(name: string): T | null;

    /**
     * Sets a service in the collection.
     * @param name - The name of the service.
     * @param service - The service to set.
     * @param lifetime - The lifetime of the service.
     * @param type - The type of the service.
     * @param parameters - The constructor parameters of the service.
     * @returns void
     */
    public readonly dependenciesAccessor: {
        set: (
            name: string,
            service: {
                lifetime: ServiceLifetime;
                type: any;
                parameters: { name: string; type: any }[];
            }
        ) => void;
    };
}
```

### Exceptions

```typescript
/**
 * Exception thrown when a circular dependency is detected in the dependency injection system.
 * This exception is thrown when a service depends on itself, either directly or indirectly.
 * @param dependencyName - The name of the dependency that caused the circular reference.
 * @example
 * ```typescript
 * import { CircularDependencyException } from "@contextjs/di";
 * throw new CircularDependencyException("MyService");
 * ```
 **/
export declare class CircularDependencyException extends Exception {

    /**
     * Creates an instance of CircularDependencyException.
     * @param dependencyName - The name of the dependency that caused the circular reference.
     **/
    constructor(dependencyName: string);
}

/**
 * Exception thrown when a dependency cannot be resolved in the dependency injection system.
 * This exception is thrown when a service depends on another service that cannot be resolved.
 * @param name - The name of the unresolved dependency.
 * @param type - The type of the unresolved dependency.
 * @param serviceName - The name of the service that depends on the unresolved dependency.
 * @example
 * ```typescript
 * import { UnresolvedDependencyException } from "@contextjs/di";
 * throw new UnresolvedDependencyException("MyDependency", "MyType", "MyService");
 * ```
 **/
export declare class UnresolvedDependencyException extends Exception {
    /**
     * Creates an instance of UnresolvedDependencyException.
     * @param name - The name of the unresolved dependency.
     * @param type - The type of the unresolved dependency.
     * @param serviceName - The name of the service that depends on the unresolved dependency.
     **/
    constructor(name: string, type: string, serviceName: string);
}
```