/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from "node:path";
import test, { TestContext } from "node:test";
import { fileURLToPath } from "node:url";
import typescript from "typescript";
import { Compiler } from "../../src/compiler.js";
import { ICompilerExtension } from "../../src/interfaces/i-compiler-extension.js";
import { CompileService } from "../../src/services/compile.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stubPath = path.resolve(__dirname, "../test-data");

test("CompileService: compile - returns success", (context: TestContext) => {
    const result = CompileService.compile(stubPath);

    context.assert.strictEqual(typeof result.success, "boolean");
    context.assert.ok(Array.isArray(result.diagnostics));
});

test("CompileService: compile - calls onDiagnostic callback", (context: TestContext) => {
    let called = false;

    const result = CompileService.compile(stubPath, { onDiagnostic: () => { called = true; } });

    context.assert.strictEqual(typeof result.success, "boolean");
    context.assert.strictEqual(called, true);
});

test("CompileService: compile - includes registered extension transformers", (context: TestContext) => {
    let getTransformersCalled = false;

    const fakeExtension: ICompilerExtension = {
        name: "test-transformer",
        getTransformers: (program: typescript.Program) => {
            getTransformersCalled = true;
            return {
                before: [
                    () => (sourceFile => sourceFile)
                ],
                after: null
            };
        }
    };

    Compiler.registerExtension(fakeExtension);

    const result = CompileService.compile(stubPath);

    context.assert.strictEqual(getTransformersCalled, true);
    context.assert.strictEqual(typeof result.success, "boolean");
});