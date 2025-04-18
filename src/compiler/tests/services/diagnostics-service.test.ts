/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import typescript from "typescript";
import { DiagnosticsService } from "../../src/services/diagnostics.service.js";

test("DiagnosticsService: formatTypescriptDiagnostics - with file and position", (context: TestContext) => {
    const file = typescript.createSourceFile("test.ts", "let a: string = 123;", typescript.ScriptTarget.ESNext);
    
    const diagnostics: typescript.Diagnostic[] = [
        {
            file,
            start: 12,
            length: 3,
            messageText: "Type 'number' is not assignable to type 'string'.",
            category: typescript.DiagnosticCategory.Error,
            code: 2322
        }
    ];

    const result = DiagnosticsService.formatTypescriptDiagnostics(diagnostics);

    context.assert.strictEqual(result.length, 1);
    context.assert.match(result[0], /Error at test\.ts\(\d+,\d+\):/);
    context.assert.match(result[0], /Type 'number' is not assignable to type 'string'/);
});

test("DiagnosticsService: formatTypescriptDiagnostics - without file", (context: TestContext) => {
    const diagnostics: typescript.Diagnostic[] = [
        {
            file: undefined,
            start: undefined,
            length: undefined,
            messageText: "Global error occurred.",
            category: typescript.DiagnosticCategory.Error,
            code: 9999
        }
    ];

    const result = DiagnosticsService.formatTypescriptDiagnostics(diagnostics);

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0], "Error: Global error occurred.");
});