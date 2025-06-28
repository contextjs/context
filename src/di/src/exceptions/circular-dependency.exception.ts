/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DependencyInjectionException } from "./dependency-injection.exception.js";

export class CircularDependencyException extends DependencyInjectionException {
    constructor(dependencyName: string, options?: ErrorOptions) {
        super(`Circular dependency detected: ${dependencyName}.`, options);
        this.name = "CircularDependencyException";
    }
}