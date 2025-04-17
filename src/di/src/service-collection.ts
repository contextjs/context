/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { CircularDependencyException } from "./exceptions/circular-dependency.exception.js";
import { UnresolvedDependencyException } from "./exceptions/unresolved-dependency.exception.js";
import { ConstructorParameter } from "./models/constructor-parameter.js";
import { ServiceLifetime } from "./models/service-lifetime.js";
import { Service } from "./models/service.js";

export class ServiceCollection {
    private dependencies = new Map<string, Service>();
    private instances = new Map<string, any>();

    public onResolve?: (context: {
        name: string;
        lifetime: ServiceLifetime;
        parameters: ConstructorParameter[];
        service: Service;
    }) => any | null;

    public readonly dependenciesAccessor = {
        set: (
            name: string,
            service: {
                lifetime: ServiceLifetime;
                type: any;
                parameters: { name: string; type: any }[];
            }
        ): void => {
            const parameters = service.parameters.map((t) => new ConstructorParameter(t.name, t.type));
            this.dependencies.set(name, new Service(service.type, service.lifetime, parameters));
        }
    };

    public addTransient<TInterface, TImplementation>(): void;
    public addTransient<TImplementation>(): void;
    public addTransient(): void { }

    public addSingleton<TInterface, TImplementation>(): void;
    public addSingleton<TImplementation>(): void;
    public addSingleton(): void { }

    public resolve<T>(name: string): T | null {
        return this.resolveInternal(name, new Set());
    }

    private resolveInternal<T>(name: string, resolving: Set<string>): T | null {
        if (resolving.has(name)) {
            const chain = Array.from(resolving).join(" → ");
            throw new CircularDependencyException(`${chain} → ${name}`);
        }

        const service = this.dependencies.get(name);

        if (!service) {
            try {
                const type = (globalThis as any)[name];
                if (typeof type === "function")
                    return new type();
            }
            catch { }
            return null;
        }

        if (service.lifetime === "singleton" && this.instances.has(name))
            return this.instances.get(name);

        resolving.add(name);

        try {
            if (this.onResolve) {
                const result = this.onResolve({
                    name,
                    lifetime: service.lifetime,
                    parameters: service.parameters,
                    service
                });

                if (result !== null) {
                    this.setSingletonIfNeeded(name, service, result);
                    return result;
                }
            }

            const parameters = service.parameters.map((t) => {
                const dependencyTypeName = typeof t.type === "string"
                    ? t.type
                    : t.type.name;

                const dependency = this.resolveInternal(dependencyTypeName, resolving);
                if (dependency === null)
                    throw new UnresolvedDependencyException(t.name, t.type, name);

                return dependency;
            });

            const instance = new service.type(...parameters);
            this.setSingletonIfNeeded(name, service, instance);

            return instance;
        }
        finally {
            resolving.delete(name);
        }
    }

    private setSingletonIfNeeded(name: string, service: Service, instance: any) {
        if (service.lifetime === "singleton")
            this.instances.set(name, instance);
    }
}