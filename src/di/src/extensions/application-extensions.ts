/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, ObjectExtensions, Throw } from "@contextjs/system";
import { ServiceCollection } from "../service-collection.js";
import { DependencyInjectionOptions } from "./dependency-injection-options.js";

declare module "@contextjs/system" {
    export interface Application {
        useDependencyInjection(options: (dependencyInjectionOptions: DependencyInjectionOptions) => void): Application;
        services: ServiceCollection;
    }
}

Application.prototype.useDependencyInjection = function (options: (dependencyInjectionOptions: DependencyInjectionOptions) => void): Application {
    Throw.ifNullOrUndefined(options);

    const dependencyInjectionOptions = new DependencyInjectionOptions();
    options(dependencyInjectionOptions);

    if (ObjectExtensions.isNullOrUndefined(this.services))
        this.services = new ServiceCollection();

    this.services.onResolve = dependencyInjectionOptions.onResolve;

    return this;
}