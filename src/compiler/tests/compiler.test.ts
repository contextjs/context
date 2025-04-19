/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import path from "path";
import { fileURLToPath } from "url";
import { Compiler } from "../src/compiler.js";
import { ICompilerExtension } from "../src/interfaces/i-compiler-extension.js";

test("Compiler: registerExtension - delegates to ExtensionsService", (context: TestContext) => {
    const extension: ICompilerExtension = {
        name: "mock",
        getTransformers: () => ({ before: [], after: null })
    };

    context.assert.doesNotThrow(() => Compiler.registerExtension(extension));
});

test("Compiler: compile - returns valid result", (context: TestContext) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDataPath = path.resolve(__dirname, "test-data");

    const result = Compiler.compile(testDataPath);

    context.assert.strictEqual(typeof result.success, "boolean");
    context.assert.strictEqual(Array.isArray(result.diagnostics), true);
});