/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DiagnosticSeverity } from "../../src/diagnostics/diagnostic-severity.js";
import { Diagnostic } from "../../src/diagnostics/diagnostic.js";
import { ParserResult } from "../../src/parsers/parser-result.js";
import { LiteralSyntaxNode } from "../../src/syntax/common/literal-syntax-node.js";

function createDiagnostic(message: string): Diagnostic {
    return new Diagnostic(DiagnosticSeverity.Info, { code: 1234, message }, null);
}

function createSyntaxNode(value: string): LiteralSyntaxNode {
    return new LiteralSyntaxNode(value, null!);
}

test("ParserResult: should initialize with empty diagnostics and nodes", (context: TestContext) => {
    const result = new ParserResult();

    context.assert.strictEqual(result.diagnostics.length, 0);
    context.assert.strictEqual(result.nodes.length, 0);
});

test("ParserResult: should add and retrieve a diagnostic", (context: TestContext) => {
    const result = new ParserResult();
    const diagnostic = createDiagnostic("Test diagnostic");
    result.diagnostics.push(diagnostic);

    context.assert.strictEqual(result.diagnostics.length, 1);
    context.assert.strictEqual(result.diagnostics[0].message.code, 1234);
    context.assert.strictEqual(result.diagnostics[0].message.message, "Test diagnostic");
});

test("ParserResult: should add and retrieve multiple diagnostics", (context: TestContext) => {
    const result = new ParserResult();
    const diagnostic1 = createDiagnostic("First diagnostic");
    const diagnostic2 = createDiagnostic("Second diagnostic");
    result.diagnostics.push(diagnostic1, diagnostic2);

    context.assert.strictEqual(result.diagnostics.length, 2);
    context.assert.strictEqual(result.diagnostics[0].message.code, 1234);
    context.assert.strictEqual(result.diagnostics[0].message.message, "First diagnostic");
    context.assert.strictEqual(result.diagnostics[1].message.code, 1234);
    context.assert.strictEqual(result.diagnostics[1].message.message, "Second diagnostic");
});

test("ParserResult: should add and retrieve a syntax node", (context: TestContext) => {
    const result = new ParserResult();
    const node = createSyntaxNode("Test node");
    result.nodes.push(node);

    context.assert.strictEqual(result.nodes.length, 1);
    context.assert.strictEqual((result.nodes[0] as LiteralSyntaxNode).value, "Test node");
});

test("ParserResult: should add and retrieve multiple syntax nodes", (context: TestContext) => {
    const result = new ParserResult();
    const node1 = createSyntaxNode("First node");
    const node2 = createSyntaxNode("Second node");
    result.nodes.push(node1, node2);

    context.assert.strictEqual(result.nodes.length, 2);
    context.assert.strictEqual((result.nodes[0] as LiteralSyntaxNode).value, "First node");
    context.assert.strictEqual((result.nodes[1] as LiteralSyntaxNode).value, "Second node");
});

test("ParserResult: should store both diagnostics and nodes", (context: TestContext) => {
    const result = new ParserResult();
    const diagnostic = createDiagnostic("Diagnostic message");
    const node = createSyntaxNode("Syntax node value");
    result.diagnostics.push(diagnostic);
    result.nodes.push(node);

    context.assert.strictEqual(result.diagnostics.length, 1);
    context.assert.strictEqual(result.diagnostics[0].message.code, 1234);
    context.assert.strictEqual(result.diagnostics[0].message.message, "Diagnostic message");
    context.assert.strictEqual(result.nodes.length, 1);
    context.assert.strictEqual((result.nodes[0] as LiteralSyntaxNode).value, "Syntax node value");
});

test("ParserResult: should handle empty diagnostic and node arrays when no data is added", (context: TestContext) => {
    const result = new ParserResult();

    context.assert.strictEqual(result.diagnostics.length, 0);
    context.assert.strictEqual(result.nodes.length, 0);
});

test("ParserResult: should retain diagnostics and nodes between multiple parsing operations", (context: TestContext) => {
    const result = new ParserResult();
    const diagnostic1 = createDiagnostic("Diagnostic 1");
    const diagnostic2 = createDiagnostic("Diagnostic 2");
    const node1 = createSyntaxNode("Node 1");
    const node2 = createSyntaxNode("Node 2");
    result.diagnostics.push(diagnostic1, diagnostic2);
    result.nodes.push(node1, node2);

    context.assert.strictEqual(result.diagnostics.length, 2);
    context.assert.strictEqual(result.diagnostics[0].message.message, "Diagnostic 1");
    context.assert.strictEqual(result.diagnostics[1].message.message, "Diagnostic 2");
    context.assert.strictEqual(result.nodes.length, 2);
    context.assert.strictEqual((result.nodes[0] as LiteralSyntaxNode).value, "Node 1");
    context.assert.strictEqual((result.nodes[1] as LiteralSyntaxNode).value, "Node 2");
});

test("ParserResult: should allow resetting diagnostics and nodes", (context: TestContext) => {
    const result = new ParserResult();
    const diagnostic = createDiagnostic("Test diagnostic");
    const node = createSyntaxNode("Test node");
    result.diagnostics.push(diagnostic);
    result.nodes.push(node);
    result.diagnostics = [];
    result.nodes = [];

    context.assert.strictEqual(result.diagnostics.length, 0);
    context.assert.strictEqual(result.nodes.length, 0);
});