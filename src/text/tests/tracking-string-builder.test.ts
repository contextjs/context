/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { TrackingStringBuilder } from "../src/tracking-string-builder.js"; // Adjust path as needed
import { TrackingStringBuilderException } from "../src/exceptions/tracking-string-builder.exception.js";

test("TrackingStringBuilder: append() updates column, not line", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("Hello");
    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, 5);

    sb.append(" World!");
    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, 12);
});

test("TrackingStringBuilder: appendLine() advances line, resets column", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendLine("First");
    context.assert.strictEqual(sb.outputLine, 2);
    context.assert.strictEqual(sb.outputColumn, 0);

    sb.append("abc");
    context.assert.strictEqual(sb.outputLine, 2);
    context.assert.strictEqual(sb.outputColumn, 3);
});

test("TrackingStringBuilder: appendLine() with multiple lines", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendLine("Line1\nLine2");

    context.assert.strictEqual(sb.outputLine, 3);
    context.assert.strictEqual(sb.outputColumn, 0);
});

test("TrackingStringBuilder: append() with newlines advances line/column correctly", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("A\nB\nCD");

    context.assert.strictEqual(sb.outputLine, 3);
    context.assert.strictEqual(sb.outputColumn, 2);
});

test("TrackingStringBuilder: appendEscaped() updates column", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendEscaped('ab"c');

    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, 5);
    context.assert.strictEqual(sb.toString(), 'ab\\"c');
});

test("TrackingStringBuilder: appendLineEscaped() resets column, advances line", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendLineEscaped('foo"bar');

    context.assert.ok(sb.outputLine === 2);
    context.assert.ok(sb.outputColumn === 0);
    context.assert.match(sb.toString(), /^foo\\"bar(\r\n|\n)$/);
});

test("TrackingStringBuilder: clear() resets tracking and buffer", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendLine("Line1").append("X");
    sb.clear();

    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, 0);
    context.assert.strictEqual(sb.toString(), "");
});

test("TrackingStringBuilder: appendLine() after empty append keeps correct tracking", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("");
    sb.appendLine("A");

    context.assert.strictEqual(sb.outputLine, 2);
    context.assert.strictEqual(sb.outputColumn, 0);
});

test("TrackingStringBuilder: append() with only newlines", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("\n\n");

    context.assert.strictEqual(sb.outputLine, 3);
    context.assert.strictEqual(sb.outputColumn, 0);
});

test("TrackingStringBuilder: works with appendFormatEscaped with newlines", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendFormatEscaped("{0}\n{1}", "a`", "b\"");

    context.assert.strictEqual(sb.toString(), "a\\`\nb\\\"");
    context.assert.strictEqual(sb.outputLine, 2);
    context.assert.strictEqual(sb.outputColumn, 3);
});

test("TrackingStringBuilder: Symbol.toPrimitive works with tracking", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("Hello").appendLine(" world");
    const result = `${sb}`;

    context.assert.strictEqual(result.startsWith("Hello"), true);
    context.assert.strictEqual(sb.outputLine > 1, true);
});

test("TrackingStringBuilder: handles complex multi-line scenarios", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.appendLine("L1\nL2").appendLine("L3");

    context.assert.strictEqual(sb.outputLine, 4);
    context.assert.strictEqual(sb.outputColumn, 0);
    context.assert.strictEqual(sb.toString().split(/\r?\n/).length, 4);
});

test("TrackingStringBuilder: handles mix of short, long, escaped, and formatted", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("A").appendLine("X\nY").appendFormat("M{0}", "N").appendEscaped("Z\nQ");

    context.assert.strictEqual(sb.outputLine, 4);
    context.assert.strictEqual(sb.toString().includes("A"), true);
    context.assert.strictEqual(sb.outputColumn, "Q".length);
});

test("TrackingStringBuilder: appendFormat() and appendFormatEscaped()", (context: TestContext) => {
    const sb = new TrackingStringBuilder();

    sb.appendFormat("A{0}B{1}", "x", "y");
    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, 4);
    context.assert.strictEqual(sb.toString(), "AxBy");

    sb.clear();
    sb.appendFormatEscaped("`{0}`", 'foo"bar');
    context.assert.strictEqual(sb.toString(), "\\`foo\\\"bar\\`");
    context.assert.strictEqual(sb.outputLine, 1);
    context.assert.strictEqual(sb.outputColumn, "\\`foo\\\"bar\\`".length);
});

test("TrackingStringBuilder: works with deep chaining", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("A")
        .appendLine("B")
        .appendEscaped('C"D')
        .appendLineEscaped('E`F');

    context.assert.strictEqual(sb.outputLine, 3);
    context.assert.strictEqual(sb.outputColumn, 0);
    context.assert.match(sb.toString(), /^AB(\r\n|\n)C\\"DE\\`F(\r\n|\n)$/);
});

test("TrackingStringBuilder: insert() throws", (context: TestContext) => {
    const sb = new TrackingStringBuilder();

    context.assert.throws(() => sb.insert(0, "fail"), TrackingStringBuilderException);
});

test("TrackingStringBuilder: removeSegment() throws", (context: TestContext) => {
    const sb = new TrackingStringBuilder();

    context.assert.throws(() => sb.removeSegment(0, 1), TrackingStringBuilderException);
});

test("TrackingStringBuilder: replaceSegment() throws", (context: TestContext) => {
    const sb = new TrackingStringBuilder();

    context.assert.throws(() => sb.replaceSegment(0, "fail"), TrackingStringBuilderException);
});

test("TrackingStringBuilder: clone() preserves tracking state and content", (context: TestContext) => {
    const sb = new TrackingStringBuilder();
    sb.append("abc").appendLine("def");
    sb.outputLine = 2;
    sb.outputColumn = 0;
    const clone = sb.clone();

    context.assert.notStrictEqual(clone, sb);
    context.assert.strictEqual(clone.toString(), sb.toString());
    context.assert.strictEqual(clone.outputLine, sb.outputLine);
    context.assert.strictEqual(clone.outputColumn, sb.outputColumn);

    clone.append("X");
    sb.append("Y");
    context.assert.notStrictEqual(clone.toString(), sb.toString());
});