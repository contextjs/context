/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

export class CircularDependencyException extends Exception {
    constructor(dependencyName: string) {
        super(`Circular dependency detected: ${dependencyName}.`);
        this.name = "CircularDependencyException";
    }
}