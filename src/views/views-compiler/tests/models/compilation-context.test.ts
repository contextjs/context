/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompilationContext } from "../../src/models/compilation-context.js";

const mockFiles = {
    "/a.txt": "Alpha",
    "/b.txt": "Beta",
    "/c.txt": ""
};

function mockGetFileContent(filePath: string): Promise<string> {
    if (!(filePath in mockFiles))
        return Promise.reject(new Error("File not found"));

    return Promise.resolve(mockFiles[filePath]);
}

test("CompilationContext: constructor sets properties correctly", (context: TestContext) => {
    const ctx = new CompilationContext("/project", ["/a.txt", "/b.txt"], { type: "mvc" }, mockGetFileContent);

    context.assert.strictEqual(ctx.projectRoot, "/project");
    context.assert.deepStrictEqual(ctx.files, ["/a.txt", "/b.txt"]);
    context.assert.deepStrictEqual(ctx.project, { type: "mvc" });
    context.assert.strictEqual(typeof ctx.getFileContentAsync, "function");
});

test("CompilationContext: getFileContentAsync returns correct file contents", async (context: TestContext) => {
    const ctx = new CompilationContext("/project", ["/a.txt", "/b.txt"], {}, mockGetFileContent);

    context.assert.strictEqual(await ctx.getFileContentAsync("/a.txt"), "Alpha");
    context.assert.strictEqual(await ctx.getFileContentAsync("/b.txt"), "Beta");
    context.assert.strictEqual(await ctx.getFileContentAsync("/c.txt"), "");
});

test("CompilationContext: getFileContentAsync throws for unknown file", async (context: TestContext) => {
    const ctx = new CompilationContext("/project", [], {}, mockGetFileContent);

    await context.assert.rejects(() => ctx.getFileContentAsync("/notfound.txt"));
});

test("CompilationContext: empty files and config are handled correctly", (context: TestContext) => {
    const ctx = new CompilationContext("/root", [], {}, mockGetFileContent);

    context.assert.strictEqual(ctx.projectRoot, "/root");
    context.assert.deepStrictEqual(ctx.files, []);
    context.assert.deepStrictEqual(ctx.project, {});
});

test("CompilationContext: getFileContentAsync can be async and resolve after delay", async (context: TestContext) => {
    const delayedGetFileContent = (filePath: string) => new Promise<string>(resolve => setTimeout(() => resolve(filePath.toUpperCase()), 10));
    const ctx = new CompilationContext("/project", [], {}, delayedGetFileContent);

    context.assert.strictEqual(await ctx.getFileContentAsync("/z.txt"), "/Z.TXT");
});

test("CompilationContext: constructor can accept undefined config and files", (context: TestContext) => {
    const ctx = new CompilationContext("/foo", undefined as any, undefined as any, mockGetFileContent);

    context.assert.strictEqual(ctx.projectRoot, "/foo");
    context.assert.deepStrictEqual(ctx.files, []);
    context.assert.deepStrictEqual(ctx.project, undefined);
});

test("CompilationContext: getFileContentAsync delegate can always reject", async (context: TestContext) => {
    const failingDelegate = (_filePath: string) => Promise.reject(new Error("Always fails"));
    const ctx = new CompilationContext("/project", [], {}, failingDelegate);

    await context.assert.rejects(() => ctx.getFileContentAsync("/a.txt"), /Always fails/);
});