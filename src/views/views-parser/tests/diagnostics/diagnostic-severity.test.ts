/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DiagnosticSeverity } from "../../src/diagnostics/diagnostic-severity.js";

test("DiagnosticSeverity: enum values", (context: TestContext) => {
    context.assert.strictEqual(DiagnosticSeverity.Info, "Info");
    context.assert.strictEqual(DiagnosticSeverity.Warning, "Warning");
    context.assert.strictEqual(DiagnosticSeverity.Error, "Error");
});

test("DiagnosticSeverity: assignment and usage", (context: TestContext) => {
    let severity: DiagnosticSeverity = DiagnosticSeverity.Info;
    context.assert.strictEqual(severity, "Info");

    severity = DiagnosticSeverity.Warning;
    context.assert.strictEqual(severity, "Warning");

    severity = DiagnosticSeverity.Error;
    context.assert.strictEqual(severity, "Error");
});