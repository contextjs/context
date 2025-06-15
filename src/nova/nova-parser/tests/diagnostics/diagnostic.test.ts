/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DiagnosticMessage } from "../../src/diagnostics/diagnostic-message.js";
import { DiagnosticSeverity } from "../../src/diagnostics/diagnostic-severity.js";
import { Diagnostic } from "../../src/diagnostics/diagnostic.js";

class TestLocation {
    toString() { return "L:1:2"; }
}

const TEST_MESSAGE = new DiagnosticMessage(1234, "Test diagnostic message");

test("Diagnostic: constructor sets fields", (context: TestContext) => {
    const location = new TestLocation();
    const diagnostic = new Diagnostic(DiagnosticSeverity.Warning, TEST_MESSAGE, location as any);

    context.assert.strictEqual(diagnostic.severity, DiagnosticSeverity.Warning);
    context.assert.strictEqual(diagnostic.location, location);
    context.assert.strictEqual(diagnostic.message, TEST_MESSAGE);
});

test("Diagnostic: info, warning, error static constructors", (context: TestContext) => {
    const location = new TestLocation();

    const infoDiagnostic = Diagnostic.info(TEST_MESSAGE, location as any);
    context.assert.strictEqual(infoDiagnostic.severity, DiagnosticSeverity.Info);
    context.assert.strictEqual(infoDiagnostic.message, TEST_MESSAGE);
    context.assert.strictEqual(infoDiagnostic.location, location);

    const warningDiagnostic = Diagnostic.warning(TEST_MESSAGE, null);
    context.assert.strictEqual(warningDiagnostic.severity, DiagnosticSeverity.Warning);
    context.assert.strictEqual(warningDiagnostic.message, TEST_MESSAGE);
    context.assert.strictEqual(warningDiagnostic.location, null);

    const errorDiagnostic = Diagnostic.error(TEST_MESSAGE);
    context.assert.strictEqual(errorDiagnostic.severity, DiagnosticSeverity.Error);
    context.assert.strictEqual(errorDiagnostic.message, TEST_MESSAGE);
    context.assert.strictEqual(errorDiagnostic.location, null);
});

test("Diagnostic: toString with and without location", (context: TestContext) => {
    const location = new TestLocation();
    const customMsg = new DiagnosticMessage(5555, "Something went wrong");

    const diagnosticWithLocation = new Diagnostic(DiagnosticSeverity.Error, customMsg, location as any);
    context.assert.strictEqual(diagnosticWithLocation.toString(), `[Error] 5555: Something went wrong [L:1:2]`);

    const diagnosticWithoutLocation = new Diagnostic(DiagnosticSeverity.Info, customMsg);
    context.assert.strictEqual(diagnosticWithoutLocation.toString(), `[Info] 5555: Something went wrong`);
});