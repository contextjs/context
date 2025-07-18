/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";
import { paramTypesRewriter } from "./metadata-type.transformer.js";
import { serviceCollectionTransformer } from "./service-collection.transformer.js";
import { serviceResolverTransformer } from "./service-resolver.transformer.js";

export default {
    name: "@contextjs/di",
    getTransformers(program: typescript.Program) {
        return {
            before: [
                serviceCollectionTransformer({
                    addSingleton: "singleton",
                    addTransient: "transient",
                    addScoped: "scoped"
                }, program),
                serviceResolverTransformer
            ],
            after: [paramTypesRewriter(program)]
        };
    }
};