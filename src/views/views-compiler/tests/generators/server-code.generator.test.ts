/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/compilationContextjs/compilationContext/blob/main/LICENSE
 */

import "../../src/extensions/syntax-node-extension-imports.js";

import { Language } from "@contextjs/views";
import test, { TestContext } from "node:test";
import { ServerCodeGenerator } from "../../src/generators/server/server-code.generator.js";
import { CompilationContext } from "../../src/models/compilation-context.js";
import { CompiledView } from "../../src/models/views/compiled-view{t}.js";
import { ServerCompiledViewData } from "../../src/models/views/server-compiled-view-data.js";

function createCompilationContext(opts: Partial<{
    files: string[];
    projectRoot: string;
    project: Record<string, any>;
    fileContent: Record<string, string>;
    generateSourceMap: boolean;
}> = {}) {
    const files = opts.files ?? ["views/index.tshtml"];
    const fileContent = opts.fileContent ?? { "views/index.tshtml": "<div>Hello</div>" };
    return new CompilationContext(
        opts.projectRoot ?? "/repo",
        files,
        opts.project ?? { kind: "server" },
        async (filePath: string) => {
            if (filePath in fileContent) return fileContent[filePath];
            throw new Error("File not found: " + filePath);
        }
    ) as CompilationContext & { generateSourceMap?: boolean };
}

function generateSourceMap(compilationContext: any, value: boolean) {
    compilationContext.generateSourceMap = value;
}

test("ServerCodeGenerator: generates minimal code for valid input (no source map)", async (context: TestContext) => {
    const compilationContext = createCompilationContext();
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/index.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.ok(result instanceof CompiledView);
    context.assert.ok(result.data instanceof ServerCompiledViewData);
    context.assert.strictEqual(result.data.className, "ViewsIndex");
    context.assert.strictEqual(result.data.generatedFileName, "ViewsIndex.ts");
    context.assert.strictEqual(result.data.sourceMap, null);
    context.assert.match(result.data.source, /export default class ViewsIndex extends ServerView/);
    context.assert.match(result.data.source, /public async renderAsync\(model\): Promise<string>/);
    context.assert.match(result.data.source, /return this\.getOutput\(\);/);
    context.assert.ok(!result.data.source.includes("__sourcemap"));
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("ServerCodeGenerator: generates code with source map (enabled)", async (context: TestContext) => {
    const compilationContext = createCompilationContext();
    generateSourceMap(compilationContext, true);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/index.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.ok(result.data.sourceMap && typeof result.data.sourceMap === "string");
    context.assert.ok(result.data.source.includes("__sourcemap"));
    context.assert.match(result.data.source, /const __sourcemap = /);
});

test("ServerCodeGenerator: generates correct class and file names for deeply nested files", async (context: TestContext) => {
    const compilationContext = createCompilationContext({
        files: ["views/components/shared/button.tshtml"],
        fileContent: { "views/components/shared/button.tshtml": "<button>Hi</button>" },
        projectRoot: "/repo"
    });
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/components/shared/button.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.strictEqual(result.data.className, "ViewsComponentsSharedButton");
    context.assert.strictEqual(result.data.generatedFileName, "ViewsComponentsSharedButton.ts");
    context.assert.ok(result.data.source.includes("export default class ViewsComponentsSharedButton extends ServerView"));
});

test("ServerCodeGenerator: correctly formats metadata with filePath and handles special characters", async (context: TestContext) => {
    const compilationContext = createCompilationContext({
        files: ["views/weird path 'with\"chars.tshtml"],
        fileContent: { "views/weird path 'with\"chars.tshtml": "<x></x>" }
    });
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/weird path 'with\"chars.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.match(result.data.source, /filePath: "views\/weird path 'with\\"chars\.tshtml"/);
});

test("ServerCodeGenerator: handles empty template gracefully", async (context: TestContext) => {
    const compilationContext = createCompilationContext({ files: ["views/empty.tshtml"], fileContent: { "views/empty.tshtml": "" } });
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/empty.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.strictEqual(result.data.className, "ViewsEmpty");
    context.assert.match(result.data.source, /return this\.getOutput\(\);/);
    context.assert.strictEqual(result.diagnostics.length, 0);
});

test("ServerCodeGenerator: throws if file is not found", async (context: TestContext) => {
    const compilationContext = createCompilationContext({ files: ["views/exists.tshtml"], fileContent: {} });
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/exists.tshtml";
    const language = Language.TSHTML;

    await context.assert.rejects(async () => { await generator.generateAsync(filePath, language); }, { message: /File not found/ });
});

test("ServerCodeGenerator: supports non-standard projectRoot and backslashes", async (context: TestContext) => {
    const compilationContext = createCompilationContext({
        files: ["app\\components\\header.tshtml"],
        fileContent: { "app\\components\\header.tshtml": "<header>H</header>" },
        projectRoot: "app\\"
    });
    generateSourceMap(compilationContext, false);

    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "app\\components\\header.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.strictEqual(result.data.className, "ComponentsHeader");
    context.assert.strictEqual(result.data.generatedFileName, "ComponentsHeader.ts");
});

test("ServerCodeGenerator: preserves Unicode in file path and content", async (context: TestContext) => {
    const compilationContext = createCompilationContext({
        files: ["views/こんにちは.tshtml"],
        fileContent: { "views/こんにちは.tshtml": "<div>世界</div>" }
    });
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/こんにちは.tshtml";
    const language = Language.TSHTML;
    const result = await generator.generateAsync(filePath, language);

    context.assert.strictEqual(result.data.className, "Viewsこんにちは");
    context.assert.ok(result.data.source.includes("世界"));
});

test("ServerCodeGenerator: output is always a valid CompiledView with ServerCompiledViewData", async (context: TestContext) => {
    const compilationContext = createCompilationContext();
    generateSourceMap(compilationContext, false);
    const generator = new ServerCodeGenerator(compilationContext);
    const filePath = "views/index.tshtml";
    const language = Language.TSHTML;

    const result = await generator.generateAsync(filePath, language);
    context.assert.ok(result instanceof CompiledView);
    context.assert.ok(result.data instanceof ServerCompiledViewData);
    context.assert.ok(typeof result.data.source === "string");
    context.assert.ok(typeof result.data.className === "string");
    context.assert.ok(typeof result.data.generatedFileName === "string");
    context.assert.ok(result.data.sourceMap === null);
});