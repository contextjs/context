/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessages } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { CompilationContext } from "../src/models/compilation-context.js";
import { CompiledView } from "../src/models/views/compiled-view{t}.js";
import { ViewsCompiler } from "../src/views-compiler.js";

class FakeCodeGenerator {
    public generated: { filePath: string }[] = [];
    async generateAsync(filePath: string): Promise<CompiledView> {
        this.generated.push({ filePath });
        return new CompiledView(filePath, "server", [], { code: `compiled:${filePath}` });
    }
}

function getTestFileContent(files: Record<string, string>): (filePath: string) => Promise<string> {
    return async (filePath) => {
        if (filePath in files) return files[filePath];
        throw new Error("File not found: " + filePath);
    };
}

function makeContext(opts: Partial<{
    files: string[];
    project: Record<string, any>;
    fileContent: Record<string, string>;
}>) {
    const files = opts.files || [];
    const project = opts.project || { kind: "server" };
    const fileContent = opts.fileContent || {};

    return new CompilationContext(
        "/project",
        files,
        project,
        getTestFileContent(fileContent)
    );
}

function createCompilerWithGenerator(context: CompilationContext, generator: any) {
    const compiler = new ViewsCompiler(context);
    (compiler as any).codeGenerator = generator;

    return compiler;
}

test("ViewsCompiler: compiles all files (happy path)", async (context: TestContext) => {
    const files = ["a.tshtml", "b.tshtml"];
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files, fileContent: { "a.tshtml": "A", "b.tshtml": "B" } });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    const results = await compiler.compileAllAsync();

    context.assert.ok(results[0] instanceof CompiledView);
    context.assert.strictEqual(results.length, 2);
    context.assert.deepStrictEqual(generator.generated, [{ filePath: "a.tshtml" }, { filePath: "b.tshtml" }]);
});

test("ViewsCompiler: compiles single file (happy path)", async (context: TestContext) => {
    const file = "test.tshtml";
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files: [file], fileContent: { [file]: "<div/>" } });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    const result = await compiler.compileFileAsync(file);

    context.assert.ok(result instanceof CompiledView);
    context.assert.deepStrictEqual(generator.generated, [{ filePath: file }]);
    context.assert.strictEqual(result.filePath, file);
    context.assert.strictEqual(result.kind, "server");
    context.assert.deepStrictEqual(result.diagnostics, []);
    context.assert.deepStrictEqual(result.data, { code: `compiled:${file}` });
});

test("ViewsCompiler: returns error if codeGenerator is null (unsupported kind)", async (context: TestContext) => {
    const file = "test.tshtml";
    const compilationContext = makeContext({ files: [file], project: { kind: "unsupported" }, fileContent: { [file]: "foo" } });
    const compiler = new ViewsCompiler(compilationContext);
    const result = await compiler.compileFileAsync(file);

    context.assert.ok(result instanceof CompiledView);
    context.assert.strictEqual(result.filePath, file);
    context.assert.strictEqual(result.kind, "unsupported");
    context.assert.deepStrictEqual(result.data, {});
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.UnsupportedProjectType("unsupported").code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.UnsupportedProjectType("unsupported").message);
});

test("ViewsCompiler: returns error if file is not in context.files", async (context: TestContext) => {
    const file = "other.tshtml";
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files: ["not-this.tshtml"], fileContent: { [file]: "X" } });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    const result = await compiler.compileFileAsync(file);

    context.assert.ok(result instanceof CompiledView);
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.UnknownCompilationContextFile(file).code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.UnknownCompilationContextFile(file).message);
});

test("ViewsCompiler: returns error if file extension is unsupported", async (context: TestContext) => {
    const file = "test.txt";
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files: [file], fileContent: { [file]: "hi" } });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    const result = await compiler.compileFileAsync(file);
    
    context.assert.ok(result instanceof CompiledView);
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.UnsupportedLanguage.code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.UnsupportedLanguage.message);
});

test("ViewsCompiler: works if context.files is empty (edge case)", async (context: TestContext) => {
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files: [], fileContent: {} });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    const result = await compiler.compileFileAsync("foo.tshtml");

    context.assert.ok(result instanceof CompiledView);
    context.assert.strictEqual(result.diagnostics[0].message.code, DiagnosticMessages.UnknownCompilationContextFile("foo.tshtml").code);
    context.assert.strictEqual(result.diagnostics[0].message.message, DiagnosticMessages.UnknownCompilationContextFile("foo.tshtml").message);
});

test("ViewsCompiler: does not call codeGenerator if error early-out occurs", async (context: TestContext) => {
    const file = "bad.txt";
    const generator = new FakeCodeGenerator();
    const compilationContext = makeContext({ files: [file], fileContent: {} });
    const compiler = createCompilerWithGenerator(compilationContext, generator);
    await compiler.compileFileAsync(file);

    context.assert.deepStrictEqual(generator.generated, []);
});