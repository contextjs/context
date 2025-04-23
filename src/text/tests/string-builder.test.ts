/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ArgumentOutOfRangeException } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { StringBuilder } from "../src/string-builder.js";

test("StringBuilder: append() and toString()", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("Hello").append(", ").append("world");
    context.assert.strictEqual(sb.toString(), "Hello, world");
});

test("StringBuilder: appendLine() appends newline", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.appendLine("Hello").appendLine("World");
    context.assert.match(sb.toString(), /Hello/);
    context.assert.match(sb.toString(), /World/);
    context.assert.match(sb.toString(), /\n|\r/);
});

test("StringBuilder: appendFormat() replaces placeholders", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.appendFormat("{0} + {1} = {2}", 2, 3, 5);
    context.assert.strictEqual(sb.toString(), "2 + 3 = 5");
});

test("StringBuilder: insert() inserts segment", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A").append("C").insert(1, "B");
    context.assert.strictEqual(sb.toString(), "ABC");
});

test("StringBuilder: removeSegment() removes segments", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A").append("B").append("C");
    sb.removeSegment(1);
    context.assert.strictEqual(sb.toString(), "AC");
});

test("StringBuilder: replaceSegment() replaces content", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("Hello").replaceSegment(0, "Hi");
    context.assert.strictEqual(sb.toString(), "Hi");
});

test("StringBuilder: clear() resets state", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("Hello").clear();
    context.assert.strictEqual(sb.length, 0);
    context.assert.strictEqual(sb.segmentCount, 0);
    context.assert.strictEqual(sb.toString(), "");
});

test("StringBuilder: length and segmentCount are correct", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("123").append("4567");
    context.assert.strictEqual(sb.length, 7);
    context.assert.strictEqual(sb.segmentCount, 2);
});

test("StringBuilder: isEmpty returns true only when empty", (context: TestContext) => {
    const sb = new StringBuilder();
    context.assert.strictEqual(sb.isEmpty, true);
    sb.append("x");
    context.assert.strictEqual(sb.isEmpty, false);
    sb.clear();
    context.assert.strictEqual(sb.isEmpty, true);
});

test("StringBuilder: insert() out of range throws", (context: TestContext) => {
    const sb = new StringBuilder();
    context.assert.throws(() => sb.insert(5, "fail"), ArgumentOutOfRangeException);
});

test("StringBuilder: removeSegment() out of range throws", (context: TestContext) => {
    const sb = new StringBuilder();
    context.assert.throws(() => sb.removeSegment(0), ArgumentOutOfRangeException);
});

test("StringBuilder: replaceSegment() out of range throws", (context: TestContext) => {
    const sb = new StringBuilder();
    context.assert.throws(() => sb.replaceSegment(0, "fail"), ArgumentOutOfRangeException);
});

test("StringBuilder: appending empty strings still updates segment count", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("").append("");
    context.assert.strictEqual(sb.segmentCount, 2);
    context.assert.strictEqual(sb.length, 0);
    context.assert.strictEqual(sb.toString(), "");
});

test("StringBuilder: deep chaining produces expected output", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A")
        .append("B")
        .appendFormat("{0}{1}", "C", "D")
        .insert(2, "_")
        .appendLine("E")
        .append("F");

    const result = sb.toString();
    context.assert.ok(result.startsWith("AB"));
    context.assert.ok(result.includes("_"));
    context.assert.ok(result.includes("CD"));
    context.assert.ok(result.includes("E"));
    context.assert.ok(result.endsWith("F"));
});

test("StringBuilder: performance with high volume appends", (context: TestContext) => {
    const sb = new StringBuilder();
    const count = 10_000;
    for (let i = 0; i < count; i++)
        sb.append("x");

    context.assert.strictEqual(sb.length, count);
    context.assert.strictEqual(sb.segmentCount, count);
    context.assert.strictEqual(sb.toString().length, count);
});

test("StringBuilder: handles mix of short and long segments", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A");
    sb.append("x".repeat(1000));
    sb.append("B");

    const result = sb.toString();
    context.assert.strictEqual(result.length, 1002);
    context.assert.ok(result.startsWith("A"));
    context.assert.ok(result.endsWith("B"));
    context.assert.strictEqual(sb.segmentCount, 3);
});

test("StringBuilder: performance with high volume appends", (context: TestContext) => {
    const sb = new StringBuilder();
    const count = 10_000;
    for (let i = 0; i < count; i++)
        sb.append("x");

    context.assert.strictEqual(sb.length, count);
    context.assert.strictEqual(sb.segmentCount, count);
    context.assert.strictEqual(sb.toString().length, count);
});

test("StringBuilder: handles mix of short and long segments", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A");
    sb.append("x".repeat(1000));
    sb.append("B");

    const result = sb.toString();
    context.assert.strictEqual(result.length, 1002);
    context.assert.ok(result.startsWith("A"));
    context.assert.ok(result.endsWith("B"));
    context.assert.strictEqual(sb.segmentCount, 3);
});

test("StringBuilder: toArray() returns a copy of segments", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("A").append("B").append("C");
    const segments = sb.toArray();

    context.assert.deepStrictEqual(segments, ["A", "B", "C"]);
    context.assert.notStrictEqual(segments, sb["_segments"]); // ensure it's a copy
});

test("StringBuilder: clone() returns a copy with same content and length", (context: TestContext) => {
    const sb1 = new StringBuilder();
    sb1.append("X").append("Y").append("Z");

    const sb2 = sb1.clone();

    context.assert.strictEqual(sb2.toString(), sb1.toString());
    context.assert.strictEqual(sb2.length, sb1.length);
    context.assert.strictEqual(sb2.segmentCount, sb1.segmentCount);
    context.assert.notStrictEqual(sb2, sb1);
    context.assert.deepStrictEqual(sb2.toArray(), sb1.toArray());
});

test("StringBuilder: clone() returns a copy with same content and length", (context: TestContext) => {
    const sb1 = new StringBuilder();
    sb1.append("X").append("Y").append("Z");

    const sb2 = sb1.clone();

    context.assert.strictEqual(sb2.toString(), sb1.toString());
    context.assert.strictEqual(sb2.length, sb1.length);
    context.assert.strictEqual(sb2.segmentCount, sb1.segmentCount);
    context.assert.notStrictEqual(sb2, sb1);
    context.assert.deepStrictEqual(sb2.toArray(), sb1.toArray());

    // Modify original and confirm clone is unaffected
    sb1.append("!",);
    context.assert.notStrictEqual(sb1.toString(), sb2.toString());
});

test("StringBuilder: supports implicit string conversion via Symbol.toPrimitive", (context: TestContext) => {
    const sb = new StringBuilder();
    sb.append("Hello").append(" ").append("world");

    const result = `${sb}`; // Triggers Symbol.toPrimitive
    context.assert.strictEqual(result, "Hello world");
});