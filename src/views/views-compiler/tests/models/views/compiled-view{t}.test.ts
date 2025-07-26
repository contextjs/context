/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { Diagnostic } from "../../../src/models/diagnostic.js";
import { CompiledView } from "../../../src/models/views/compiled-view{t}.js";

test("CompiledView: constructor assigns all fields (basic usage)", (context: TestContext) => {
    const data = { source: "code", className: "Home" };
    const diagnostics = [Diagnostic.error(DiagnosticMessages.InvalidName, "file.tshtml")];
    const view = new CompiledView("file.tshtml", "server", diagnostics, data);

    context.assert.strictEqual(view.filePath, "file.tshtml");
    context.assert.strictEqual(view.kind, "server");
    context.assert.deepStrictEqual(view.diagnostics, diagnostics);
    context.assert.deepStrictEqual(view.data, data);
});

test("CompiledView: data can be any type (primitive, array, object)", (context: TestContext) => {
    const view1 = new CompiledView<number>("file", "test", [], 123);
    const view2 = new CompiledView<string[]>("file", "test", [], ["a", "b"]);
    const view3 = new CompiledView<{ x: number; y: number }>("file", "test", [], { x: 1, y: 2 });

    context.assert.strictEqual(view1.data, 123);
    context.assert.deepStrictEqual(view2.data, ["a", "b"]);
    context.assert.deepStrictEqual(view3.data, { x: 1, y: 2 });
});

test("CompiledView: diagnostics defaults to empty array if null or undefined", (context: TestContext) => {
    const view = new CompiledView("file", "server", undefined!, { foo: "bar" });
    const view2 = new CompiledView("file", "server", null!, { foo: "bar" });

    context.assert.deepStrictEqual(view.diagnostics, []);
    context.assert.deepStrictEqual(view2.diagnostics, []);
});

test("CompiledView: works with generic types", (context: TestContext) => {
    interface MyData { foo: string; bar: number; }
    const data: MyData = { foo: "abc", bar: 42 };
    const view = new CompiledView<MyData>("file", "custom", [], data);

    context.assert.deepStrictEqual(view.data, data);
});

test("CompiledView: accepts empty string or empty data", (context: TestContext) => {
    const view = new CompiledView("file", "none", [], "");

    context.assert.strictEqual(view.data, "");
});

test("CompiledView: accepts empty diagnostics", (context: TestContext) => {
    const view = new CompiledView("file", "none", [], { foo: "bar" });

    context.assert.deepStrictEqual(view.diagnostics, []);
});

test("CompiledView: different kinds can be used", (context: TestContext) => {
    const kinds = ["server", "spa", "desktop", "static", "library", "universal"];

    for (const kind of kinds) {
        const view = new CompiledView("file", kind, [], { kind });
        context.assert.strictEqual(view.kind, kind);
    }
});