/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DiagnosticMessage } from "../../src/diagnostics/diagnostic-message.js";

test("DiagnosticMessage: constructor sets code and message", (context: TestContext) => {
    const message = new DiagnosticMessage(100, "Test message");

    context.assert.strictEqual(message.code, 100);
    context.assert.strictEqual(message.message, "Test message");
});

test("DiagnosticMessage: code is readonly", (context: TestContext) => {
    const message = new DiagnosticMessage(200, "Readonly code");
    try {
        (message as any).code = 300;
        context.assert.fail("Code should be readonly");
    }
    catch {
        context.assert.ok(true);
    }
});

test("DiagnosticMessage: message is readonly", (context: TestContext) => {
    const message = new DiagnosticMessage(201, "Readonly message");
    try {
        (message as any).message = "Mutated";
        context.assert.fail("Message should be readonly");
    }
    catch {
        context.assert.ok(true);
    }
});

test("DiagnosticMessage: supports empty string message", (context: TestContext) => {
    const message = new DiagnosticMessage(202, "");

    context.assert.strictEqual(message.message, "");
});

test("DiagnosticMessage: supports negative and zero codes", (context: TestContext) => {
    const zeroCode = new DiagnosticMessage(0, "Zero");
    const negativeCode = new DiagnosticMessage(-1, "Negative");

    context.assert.strictEqual(zeroCode.code, 0);
    context.assert.strictEqual(negativeCode.code, -1);
});

test("DiagnosticMessage: supports unicode and special characters in message", (context: TestContext) => {
    const unicode = new DiagnosticMessage(300, "Συντακτικό σφάλμα – 🚀");

    context.assert.strictEqual(unicode.message, "Συντακτικό σφάλμα – 🚀");
});