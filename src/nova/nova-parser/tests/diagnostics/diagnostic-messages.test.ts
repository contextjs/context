/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DiagnosticMessage } from "../../src/diagnostics/diagnostic-message.js";
import { DiagnosticMessages } from "../../src/diagnostics/diagnostic-messages.js";

test("DiagnosticMessages: InvalidComment", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.InvalidComment;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 1000);
    context.assert.strictEqual(diagnosticMessage.message, "Invalid comment syntax");
});

test("DiagnosticMessages: UnterminatedComment", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.UnterminatedComment("-->");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 1001);
    context.assert.strictEqual(diagnosticMessage.message, "Unterminated comment: missing -->");
});

test("DiagnosticMessages: InvalidName", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.InvalidName;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2000);
    context.assert.strictEqual(diagnosticMessage.message, "Invalid name syntax.");
});

test("DiagnosticMessages: UnterminatedAttributeValue", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.UnterminatedAttributeValue;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2001);
    context.assert.strictEqual(diagnosticMessage.message, "Unterminated attribute value.");
});

test("DiagnosticMessages: InvalidAttributeValue", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.InvalidAttributeValue;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2002);
    context.assert.strictEqual(diagnosticMessage.message, "Invalid attribute value syntax.");
});

test("DiagnosticMessages: ExpectedEquals", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedEquals;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2003);
    context.assert.strictEqual(diagnosticMessage.message, "Expected '=' symbol after name.");
});

test("DiagnosticMessages: InvalidTagFormat", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.InvalidTagFormat;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2004);
    context.assert.strictEqual(diagnosticMessage.message, "Invalid tag format. Expected a name followed by optional attributes.");
});

test("DiagnosticMessages: ExpectedCDATAStart", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedCDATAStart;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2005);
    context.assert.strictEqual(diagnosticMessage.message, 'Expected start of the "<![CDATA[" tag.');
});

test("DiagnosticMessages: MissingCDATAEnd", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.MissingCDATAEnd;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2006);
    context.assert.strictEqual(diagnosticMessage.message, "Missing CDATA section end (expected \"]]>\").");
});

test("DiagnosticMessages: InvalidTagName", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.InvalidTagName("123Invalid");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2007);
    context.assert.strictEqual(diagnosticMessage.message, "Invalid tag name: 123Invalid. Tag names must start with a letter and can contain letters, digits, hyphens, underscores, and periods.");
});

test("DiagnosticMessages: UnterminatedTag", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.UnterminatedTag("div");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2008);
    context.assert.strictEqual(diagnosticMessage.message, "Unterminated tag: missing closing tag for <div>.");
});

test("DiagnosticMessages: MismatchedEndTag", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.MismatchedEndTag("div", "span");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2009);
    context.assert.strictEqual(diagnosticMessage.message, "Mismatched end tag: expected </div>, but found </span>.");
});

test("DiagnosticMessages: EmptyAttributeValue", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.EmptyAttributeValue;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2010);
    context.assert.strictEqual(diagnosticMessage.message, "Empty attribute value is not allowed. Attribute values must be non-empty strings.");
});

test("DiagnosticMessages: ExpectedEndStyleTag", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedEndStyleTag("style");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2011);
    context.assert.strictEqual(diagnosticMessage.message, "Expected end of style tag (</style>), but found: style");
});

test("DiagnosticMessages: ExpectedEndScriptTag", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedEndScriptTag("script");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 2012);
    context.assert.strictEqual(diagnosticMessage.message, "Expected end of script tag (</script>), but found: script");
});

test("DiagnosticMessages: ExpectedTransitionMarker", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedTransitionMarker("@");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 3000);
    context.assert.strictEqual(diagnosticMessage.message, "Expected a transition marker but found: @");
});

test("DiagnosticMessages: ExpectedClosingBracket", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.ExpectedBracket("}");

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 3001);
    context.assert.strictEqual(diagnosticMessage.message, "Expected a bracket but found: }");
});

test("DiagnosticMessages: UnexpectedEndOfInput", (context: TestContext) => {
    const diagnosticMessage = DiagnosticMessages.UnexpectedEndOfInput;

    context.assert.ok(diagnosticMessage instanceof DiagnosticMessage);
    context.assert.strictEqual(diagnosticMessage.code, 9000);
    context.assert.strictEqual(diagnosticMessage.message, 'Unexpected end of input.');
});