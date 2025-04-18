/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import path from "path";
import typescript from "typescript";
import { Compiler } from "../src/compiler.js";
import { ICompilerExtension } from "../src/interfaces/i-compiler-extension.js";
import { fileURLToPath } from "url";

test("Compiler: registerExtension - delegates to ExtensionsService", (context: TestContext) => {
    const extension: ICompilerExtension = {
        name: "mock",
        getTransformers: () => ({ before: [], after: null })
    };

    context.assert.doesNotThrow(() => Compiler.registerExtension(extension));
});

test("Compiler: formatTypescriptDiagnostics - formats correctly", (context: TestContext) => {
    const file = typescript.createSourceFile("test.ts", "const a: string = 123;", typescript.ScriptTarget.ESNext);
    const diagnostics: typescript.Diagnostic[] = [
        {
            file,
            start: 10,
            length: 3,
            messageText: "Type 'number' is not assignable to type 'string'.",
            category: typescript.DiagnosticCategory.Error,
            code: 2322
        }
    ];

    const formatted = Compiler.formatTypescriptDiagnostics(diagnostics);
    context.assert.strictEqual(Array.isArray(formatted), true);
    context.assert.equal(formatted[0], "Error at test.ts(1,11): Type 'number' is not assignable to type 'string'.");
});

test("Compiler: compile - returns valid result", (context: TestContext) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDataPath = path.resolve(__dirname, "test-data");

    const result = Compiler.compile(testDataPath);

    context.assert.strictEqual(typeof result.success, "boolean");
    context.assert.strictEqual(Array.isArray(result.diagnostics), true);
});