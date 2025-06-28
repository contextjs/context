/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { InMemoryViewOutputProvider } from "../../src/providers/in-memory-view-output-provider.js";
import { IViewOutputFile } from "../../src/providers/interfaces/i-view-output-file.js";

test("InMemoryViewOutputProvider: writeAsync and readAsync store and retrieve files", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/about.view.ts", code: "export default class About {}", map: "const __sourcemap = {};" };
    await provider.writeAsync(file);
    const result = await provider.readAsync("views/about.view.ts");

    context.assert.deepStrictEqual(result, file);
});

test("InMemoryViewOutputProvider: readAsync returns null if file does not exist", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const result = await provider.readAsync("non-existent.view.ts");

    context.assert.strictEqual(result, null);
});

test("InMemoryViewOutputProvider: writeAsync overwrites existing file", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const fileA: IViewOutputFile = { filename: "views/home.view.ts", code: "A", map: "A" };
    const fileB: IViewOutputFile = { filename: "views/home.view.ts", code: "B", map: "B" };
    await provider.writeAsync(fileA);
    await provider.writeAsync(fileB);
    const result = await provider.readAsync("views/home.view.ts");

    context.assert.deepStrictEqual(result, fileB);
});

test("InMemoryViewOutputProvider: deleteAsync removes a file", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/delete.view.ts", code: "code", map: "map" };
    await provider.writeAsync(file);
    await provider.deleteAsync("views/delete.view.ts");
    const result = await provider.readAsync("views/delete.view.ts");

    context.assert.strictEqual(result, null);
});

test("InMemoryViewOutputProvider: deleteAsync does nothing if file does not exist", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    await provider.deleteAsync("does-not-exist.ts");

    context.assert.strictEqual(await provider.readAsync("does-not-exist.ts"), null);
});

test("InMemoryViewOutputProvider: listAsync returns all files", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const fileA: IViewOutputFile = { filename: "views/a.view.ts", code: "A", map: "mapA" };
    const fileB: IViewOutputFile = { filename: "views/b.view.ts", code: "B", map: "mapB" };
    await provider.writeAsync(fileA);
    await provider.writeAsync(fileB);
    const files = await provider.listAsync();

    context.assert.strictEqual(files.length, 2);
    context.assert.ok(files.some(f => f.filename === fileA.filename && f.code === "A"));
    context.assert.ok(files.some(f => f.filename === fileB.filename && f.code === "B"));
});

test("InMemoryViewOutputProvider: listAsync returns empty array if no files", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const files = await provider.listAsync();

    context.assert.deepStrictEqual(files, []);
});

test("InMemoryViewOutputProvider: can handle unicode filenames and content", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/συντακτικό.view.ts", code: "const Σ = 1;", map: "const __sourcemap = '🚀';" };
    await provider.writeAsync(file);
    const result = await provider.readAsync("views/συντακτικό.view.ts");

    context.assert.deepStrictEqual(result, file);
});

test("InMemoryViewOutputProvider: multiple files with same content are stored independently", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const fileA: IViewOutputFile = { filename: "views/file1.view.ts", code: "X", map: "mapX" };
    const fileB: IViewOutputFile = { filename: "views/file2.view.ts", code: "X", map: "mapX" };
    await provider.writeAsync(fileA);
    await provider.writeAsync(fileB);
    const resultA = await provider.readAsync("views/file1.view.ts");
    const resultB = await provider.readAsync("views/file2.view.ts");

    context.assert.deepStrictEqual(resultA, fileA);
    context.assert.deepStrictEqual(resultB, fileB);
});

test("InMemoryViewOutputProvider: listAsync reflects deletions accurately", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const fileA: IViewOutputFile = { filename: "views/a.view.ts", code: "A", map: "mapA" };
    const fileB: IViewOutputFile = { filename: "views/b.view.ts", code: "B", map: "mapB" };
    await provider.writeAsync(fileA);
    await provider.writeAsync(fileB);
    await provider.deleteAsync("views/a.view.ts");
    const files = await provider.listAsync();

    context.assert.strictEqual(files.length, 1);
    context.assert.strictEqual(files[0].filename, fileB.filename);
    context.assert.strictEqual(files[0].code, fileB.code);
});

test("InMemoryViewOutputProvider: writeAsync allows files with empty code and map", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/empty.view.ts", code: "", map: "" };
    await provider.writeAsync(file);
    const result = await provider.readAsync("views/empty.view.ts");

    context.assert.deepStrictEqual(result, file);
});

test("InMemoryViewOutputProvider: can store and retrieve files without map", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/no-map.view.ts", code: "abc" };
    await provider.writeAsync(file);
    const result = await provider.readAsync("views/no-map.view.ts");

    context.assert.deepStrictEqual(result, file);
});

test("InMemoryViewOutputProvider: returned IViewOutputFile is not mutated by caller", async (context: TestContext) => {
    const provider = new InMemoryViewOutputProvider();
    const file: IViewOutputFile = { filename: "views/protected.view.ts", code: "123", map: "map" };
    await provider.writeAsync(file);
    const result = await provider.readAsync("views/protected.view.ts");
    if (result)
        result.code = "MUTATED";
    const reloaded = await provider.readAsync("views/protected.view.ts");

    context.assert.strictEqual(reloaded?.code, "123");
});