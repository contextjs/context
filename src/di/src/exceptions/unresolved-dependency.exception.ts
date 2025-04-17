/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

export class UnresolvedDependencyException extends Exception {
    constructor(name: string, type: string, serviceName: string) {
        super(`Unresolved dependency "${name}" of type "${type}" for service "${serviceName}".`);
        this.name = "UnresolvedDependencyException";
    }
}