/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

//#region Extensions

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

//#endregion

//#region Classes

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

//#endregion

//#region Services

/**
 * Class representing a collection of services in the dependency injection system.
 * This class provides methods for adding and resolving services, as well as managing their lifetimes.
 **/
export declare class ServiceCollection {
    /**
     * Creates an instance of ServiceCollection.
     **/
    public constructor();

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

    /**
     * A callback that is invoked when a service is resolved.
     * This callback can be used to perform additional actions or modifications when a service is resolved.
     * @param context - The context of the resolved service.
     */
    public onResolve?: (context: {
        name: string;
        lifetime: ServiceLifetime;
        parameters: ConstructorParameter[];
        service: Service;
    }) => any | null;
}

//#endregion

//#region Exceptions

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

//#endregion