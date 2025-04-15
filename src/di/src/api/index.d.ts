/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

//#region Enums

/**
 * Enum representing the lifetime of a service in the dependency injection container.
 */
export declare enum ServiceLifetime {
    /**
     * Singleton lifetime: a single instance is created and shared across the application.
     */
    Singleton = 'Singleton',

    /**
     * Scoped lifetime: a new instance is created for each scope (e.g., per request).
     */
    Scoped = 'Scoped',

    /**
     * Transient lifetime: a new instance is created each time the service is requested.
     */
    Transient = 'Transient'
}

//#region Models

/**
 * Represents a service in the dependency injection container.
 */
export declare class Service {
    /**
     * The lifetime of the service (Singleton, Scoped, Transient).
     */
    public readonly lifetime: ServiceLifetime;

    /**
     * The type of the service.
     */
    public readonly type: any;
}

//#endregion

//#region Classes

/**
 * Represents a collection of services in the dependency injection container.
 */
export declare class ServiceCollection {
    public addTransient<TInterface, TImplementation>(): void;
    public addSingleton<TInterface, TImplementation>(): void;
    public resolve<T>(): T | null;
    public resolve<T>(interfaceName?: string): T | null;
}

//#endregion

//#region Exceptions

/**
 * Exception thrown when a scope already exists.
 */
export declare class ScopeExistsException extends Exception {
    /**
     * Creates an instance of ScopeExistsException.
     * @param scopeName The name of the scope that already exists.
     */
    constructor(scopeName: string);
}

/**
 * Exception thrown when an invalid scope is encountered.
 */
export declare class InvalidScopeException extends Exception {
    /**
     * Creates an instance of InvalidScopeException.
     * @param scopeName The name of the invalid scope.
     */
    constructor(scopeName: string);
}

//#endregion