/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ParserContextState } from "../../src/context/parser-context-state.js";
import { ParserContext } from "../../src/context/parser-context.js";
import { DiagnosticMessages } from "../../src/diagnostics/diagnostic-messages.js";
import { DiagnosticSeverity } from "../../src/diagnostics/diagnostic-severity.js";
import { EndOfFileSyntaxNode } from "../../src/syntax/common/end-of-file-syntax-node.js";

class TestSource {
    constructor(public content: string) { }
    getLocation(start: number, end: number, text: string) {
        return { start, end, text };
    }
}

test("ParserContext: property getters and constructor", (context: TestContext) => {
    const source = new TestSource("abcde");
    const parserContext = new ParserContext(source as any, null!);

    context.assert.strictEqual(parserContext.source, source);
    context.assert.strictEqual(parserContext.start, 0);
    context.assert.strictEqual(parserContext.currentPosition, 0);
    context.assert.strictEqual(parserContext.currentLength, 0);
    context.assert.strictEqual(parserContext.diagnostics.length, 0);
    context.assert.strictEqual(parserContext.currentState, null);
    context.assert.strictEqual(parserContext.currentCharacter, "a");
    context.assert.strictEqual(parserContext.nextCharacter, "b");
    context.assert.strictEqual(parserContext.previousCharacter, EndOfFileSyntaxNode.endOfFile);
});

test("ParserContext: moveNext/moveBack clamping", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("abcdef") as any, null!);

    parserContext.moveNext(3);
    context.assert.strictEqual(parserContext.currentPosition, 3);

    parserContext.moveBack(2);
    context.assert.strictEqual(parserContext.currentPosition, 1);

    parserContext.moveBack(10);
    context.assert.strictEqual(parserContext.currentPosition, 0);

    parserContext.moveNext(100);
    context.assert.strictEqual(parserContext.currentPosition, 6);
});

test("ParserContext: peek and peekMultiple, bounds", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("xyz") as any, null!);

    context.assert.strictEqual(parserContext.peek(), "x");
    context.assert.strictEqual(parserContext.peek(1), "y");
    context.assert.strictEqual(parserContext.peek(2), "z");
    context.assert.strictEqual(parserContext.peek(3), EndOfFileSyntaxNode.endOfFile);
    context.assert.strictEqual(parserContext.peek(-1), EndOfFileSyntaxNode.endOfFile);
    context.assert.strictEqual(parserContext.peekMultiple(0), "");
    context.assert.strictEqual(parserContext.peekMultiple(1), "x");
    context.assert.strictEqual(parserContext.peekMultiple(3), "xyz");

    parserContext.moveNext(2);
    context.assert.strictEqual(parserContext.peekMultiple(2), "z");
    context.assert.strictEqual(parserContext.peekMultiple(10), "z");
});

test("ParserContext: stateStack management", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("a") as any, null!);

    parserContext.setState(ParserContextState.Code);
    context.assert.strictEqual(parserContext.currentState, ParserContextState.Code);

    parserContext.setState(ParserContextState.CodeBlock);
    context.assert.strictEqual(parserContext.currentState, ParserContextState.CodeBlock);
    context.assert.strictEqual(parserContext.popState(), ParserContextState.CodeBlock);
    context.assert.strictEqual(parserContext.currentState, ParserContextState.Code);
    context.assert.strictEqual(parserContext.popState(), ParserContextState.Code);
    context.assert.strictEqual(parserContext.popState(), null);
});

test("ParserContext: reset updates startIndex", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("12345") as any, null!);
    parserContext.moveNext(3);
    parserContext.reset();

    context.assert.strictEqual(parserContext.start, 3);
});

test("ParserContext: getLocation", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("abcde") as any, null!);
    parserContext.moveNext(2);
    parserContext.reset();
    parserContext.moveNext(2);

    const location = parserContext.getLocation();
    context.assert.deepStrictEqual(location, { start: 2, end: 4, text: "cd" });

    const locationFromIndex = parserContext.getLocation(1);
    context.assert.deepStrictEqual(locationFromIndex, { start: 1, end: 4, text: "bcd" });
});

test("ParserContext: advanceWhile, peekUntil, peekWhile", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("aabbcc!!") as any, null!);

    parserContext.moveNext(0);
    const resultA = parserContext.advanceWhile(char => char === "a");
    context.assert.strictEqual(resultA, "aa");
    context.assert.strictEqual(parserContext.currentPosition, 2);

    const resultB = parserContext.peekWhile(char => char === "b");
    context.assert.strictEqual(resultB, "bb");
    context.assert.strictEqual(parserContext.currentPosition, 2);

    const resultUntilBang = parserContext.peekUntil(char => char === "!");
    context.assert.strictEqual(resultUntilBang, "bbcc!");

    parserContext.moveNext(4);
    const resultExclamation = parserContext.advanceWhile(char => char === "!");
    context.assert.strictEqual(resultExclamation, "!!");
    context.assert.strictEqual(parserContext.currentPosition, 8);
});

test("ParserContext: diagnostics API", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("foo") as any, null!);
    parserContext.addInfoDiagnostic(DiagnosticMessages.InvalidComment);
    parserContext.addWarningDiagnostic(DiagnosticMessages.InvalidComment);
    parserContext.addErrorDiagnostic(DiagnosticMessages.InvalidComment);

    context.assert.strictEqual(parserContext.diagnostics[0].severity, DiagnosticSeverity.Info);
    context.assert.strictEqual(parserContext.diagnostics[1].severity, DiagnosticSeverity.Warning);
    context.assert.strictEqual(parserContext.diagnostics[2].severity, DiagnosticSeverity.Error);
});

test("ParserContext: moveNext(0) and moveBack(0) are no-ops", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("xy") as any, null!);
    parserContext.moveNext(0);
    context.assert.strictEqual(parserContext.currentPosition, 0);

    parserContext.moveBack(0);
    context.assert.strictEqual(parserContext.currentPosition, 0);
});

test("ParserContext: moveNext with negative positions clamps to current", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("xy") as any, null!);
    parserContext.moveNext(-2);

    context.assert.strictEqual(parserContext.currentPosition, 0);
});

test("ParserContext: advanceWhile at end-of-file returns empty", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("a") as any, null!);
    parserContext.moveNext(1);
    const out = parserContext.advanceWhile(() => true);

    context.assert.strictEqual(out, "");
    context.assert.strictEqual(parserContext.currentPosition, 1);
});

test("ParserContext: peekWhile at EOF returns empty", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("x") as any, null!);
    parserContext.moveNext(1);
    const out = parserContext.peekWhile(() => true);

    context.assert.strictEqual(out, "");
});

test("ParserContext: peekUntil with always-false predicate consumes all to EOF", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("xy") as any, null!);
    const result = parserContext.peekUntil(() => false);

    context.assert.strictEqual(result.endsWith(EndOfFileSyntaxNode.endOfFile), true);
});

test("ParserContext: deep state stack push/pop works", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("abc") as any, null!);
    for (let i = 0; i < 20; i++) parserContext.setState(ParserContextState.Code);
    for (let i = 0; i < 20; i++) context.assert.strictEqual(parserContext.popState(), ParserContextState.Code);

    context.assert.strictEqual(parserContext.currentState, null);
});

test("ParserContext: getLocation on empty content returns correct location", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("") as any, null!);
    const location = parserContext.getLocation();

    context.assert.deepStrictEqual(location, { start: 0, end: 0, text: "" });
});

test("ParserContext: property immutability", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("abc") as any, null!);

    try {
        (parserContext as any).source = null;
        context.assert.fail("Should not allow mutation of source");
    }
    catch {
        context.assert.ok(true);
    }
});

test("ParserContext: advanceWhile handles emoji/code units", (context: TestContext) => {
    const parserContext = new ParserContext(new TestSource("😀a😀") as any, null!);
    const out = parserContext.advanceWhile(c => c !== "a");

    context.assert.strictEqual(out.length, 2);
    context.assert.strictEqual(parserContext.currentCharacter, "a");
});