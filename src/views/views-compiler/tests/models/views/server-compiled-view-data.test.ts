/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ServerCompiledViewData } from "../../../src/models/views/server-compiled-view-data.js";

test("ServerCompiledViewData: constructor assigns all fields correctly", (context: TestContext) => {
    const source = "export default class Foo {}";
    const sourceMap = "SourcemapContent";
    const className = "FooView";
    const data = new ServerCompiledViewData(source, sourceMap, className, "FooView.ts");

    context.assert.strictEqual(data.source, source);
    context.assert.strictEqual(data.sourceMap, sourceMap);
    context.assert.strictEqual(data.className, className);
    context.assert.strictEqual(data.generatedFileName, "FooView.ts");
});

test("ServerCompiledViewData: allows null for sourceMap", (context: TestContext) => {
    const data = new ServerCompiledViewData("code", null, "BarView", "BarView.ts");

    context.assert.strictEqual(data.sourceMap, null);
    context.assert.strictEqual(data.source, "code");
    context.assert.strictEqual(data.className, "BarView");
    context.assert.strictEqual(data.generatedFileName, "BarView.ts");
});

test("ServerCompiledViewData: allows empty string fields", (context: TestContext) => {
    const data = new ServerCompiledViewData("", "", "", "");

    context.assert.strictEqual(data.source, "");
    context.assert.strictEqual(data.sourceMap, "");
    context.assert.strictEqual(data.className, "");
    context.assert.strictEqual(data.generatedFileName, "");
});

test("ServerCompiledViewData: supports large source/sourceMap/className", (context: TestContext) => {
    const largeSource = "A".repeat(100000);
    const largeMap = "B".repeat(50000);
    const longName = "Class" + "X".repeat(1000);

    const data = new ServerCompiledViewData(largeSource, largeMap, longName, "ClassX.ts");

    context.assert.strictEqual(data.source.length, 100000);
    context.assert.strictEqual(data.sourceMap!.length, 50000);
    context.assert.strictEqual(data.className, "Class" + "X".repeat(1000));
    context.assert.strictEqual(data.generatedFileName, "ClassX.ts");
});

test("ServerCompiledViewData: supports unicode in all fields", (context: TestContext) => {
    const data = new ServerCompiledViewData("こんにちは", "🌍🚀", "クラス名", "クラス名.ts");

    context.assert.strictEqual(data.source, "こんにちは");
    context.assert.strictEqual(data.sourceMap, "🌍🚀");
    context.assert.strictEqual(data.className, "クラス名");
    context.assert.strictEqual(data.generatedFileName, "クラス名.ts");
});