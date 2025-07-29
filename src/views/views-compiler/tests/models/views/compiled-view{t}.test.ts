/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";

import { Diagnostic, DiagnosticMessages } from "@contextjs/views";
import { CompiledView } from "../../../src/models/compiled-view{t}.js";
import { ParserResult } from "@contextjs/views-parser";

test("CompiledView: constructor assigns all fields (basic usage)", (context: TestContext) => {
    const data = { source: "code", className: "Home" };
    const diagnostics = [Diagnostic.error(DiagnosticMessages.InvalidName)];
    const parserResult = new ParserResult();
    parserResult.diagnostics = diagnostics;
    const view = new CompiledView("file.tshtml", "server", parserResult, data);

    context.assert.strictEqual(view.filePath, "file.tshtml");
    context.assert.strictEqual(view.type, "server");
    context.assert.deepStrictEqual(view.parserResult.diagnostics, diagnostics);
    context.assert.deepStrictEqual(view.data, data);
});

test("CompiledView: data can be any type (primitive, array, object)", (context: TestContext) => {
    const parserResult = new ParserResult();
    const view1 = new CompiledView<number>("file", "server", parserResult, 123);
    const view2 = new CompiledView<string[]>("file", "server", parserResult, ["a", "b"]);
    const view3 = new CompiledView<{ x: number; y: number }>("file", "server", parserResult, { x: 1, y: 2 });

    context.assert.strictEqual(view1.data, 123);
    context.assert.deepStrictEqual(view2.data, ["a", "b"]);
    context.assert.deepStrictEqual(view3.data, { x: 1, y: 2 });
});

test("CompiledView: works with generic types", (context: TestContext) => {
    interface MyData { foo: string; bar: number; }
    const data: MyData = { foo: "abc", bar: 42 };
    const view = new CompiledView<MyData>("file", "server", new ParserResult(), data);

    context.assert.deepStrictEqual(view.data, data);
});

test("CompiledView: accepts empty string or empty data", (context: TestContext) => {
    const view = new CompiledView("file", "server", new ParserResult(), "");

    context.assert.strictEqual(view.data, "");
});

test("CompiledView: accepts empty diagnostics", (context: TestContext) => {
    const view = new CompiledView("file", "server", new ParserResult(), { foo: "bar" });

    context.assert.deepStrictEqual(view.parserResult.diagnostics, []);
});