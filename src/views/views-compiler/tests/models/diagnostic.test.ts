/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessage, DiagnosticSeverity, LineInfo, Location, Diagnostic as ParserDiagnostic } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { Diagnostic } from "../../src/models/diagnostic.js";

const lines = [
    new LineInfo(0, 0, 10, "text")
];
const location = new Location(
    0, 1,
    0, 4,
    0, 4,
    "some text",
    lines,
);

const TEST_MESSAGE = new DiagnosticMessage(4321, "Compiler diagnostic message");

test("Compiler Diagnostic: constructor sets fields", (context: TestContext) => {
    const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Error, TEST_MESSAGE, location);
    const filePath = "/src/views/user.views";
    const diagnostic = new Diagnostic(parserDiagnostic, filePath);

    context.assert.strictEqual(diagnostic.severity, DiagnosticSeverity.Error);
    context.assert.strictEqual(diagnostic.location, location);
    context.assert.strictEqual(diagnostic.message, TEST_MESSAGE);
    context.assert.strictEqual(diagnostic.filePath, filePath);
});

test("Compiler Diagnostic: toString includes file path", (context: TestContext) => {
    const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Info, TEST_MESSAGE, location);
    const filePath = "/views/home.views";
    const diagnostic = new Diagnostic(parserDiagnostic, filePath);

    context.assert.strictEqual(diagnostic.toString(), `[/views/home.views] [Info] 4321: Compiler diagnostic message [Line 1, Columns 2-5]`);
});

test("Compiler Diagnostic: toString with all fields", (context: TestContext) => {
    const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Warning, TEST_MESSAGE, location);
    const filePath = "myfile.views";
    const diagnostic = new Diagnostic(parserDiagnostic, filePath);

    context.assert.strictEqual(diagnostic.toString(), `[myfile.views] [Warning] 4321: Compiler diagnostic message [Line 1, Columns 2-5]`);
});

test("Compiler Diagnostic: handles null location", (context: TestContext) => {
    const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Info, TEST_MESSAGE, null);
    const filePath = "main.views";
    const diagnostic = new Diagnostic(parserDiagnostic, filePath);

    context.assert.strictEqual(diagnostic.location, null);
    context.assert.strictEqual(diagnostic.toString(), `[main.views] [Info] 4321: Compiler diagnostic message`);
});