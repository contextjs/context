/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ViewsCompiler } from "../src/views-compiler.js";
import type { ICompilationContext } from "../src/interfaces/i-compilation-context.js";
import type { IViewsCompilerOptions } from "../src/interfaces/i-views-compiler-options.js";
import { ProjectType } from "@contextjs/system";

const TEST_FILE_PATH = "index.tshtml";
const TEST_FILE_CONTENT = `<div>
    @{ if (items && items.length > 0) { <ul> @{ for (let i = 0; i < items.length; i++) { <li class="@(i % 2 === 0 ? 'even' : 'odd')"> @{ items[i].name } @{ if (items[i].selected) { <span> (selected) </span> } } </li> } } </ul> } else { <p>No items found.</p> } }
</div>`;

class MockCompilationContext implements ICompilationContext {
    projectRoot: string;
    files: string[];
    layouts?: string[] | undefined;
    partials?: string[] | undefined;
    config?: Record<string, unknown> | undefined;
    public async getFileContent(filePath: string): Promise<string> {
        return TEST_FILE_CONTENT;
    }
}

test("ViewsCompiler: compiles a simple TSHTML file into ESM source as a class", async (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: [TEST_FILE_PATH],
        projectRoot: "",
        projectType: ProjectType.Views
    };

    const compiler = new ViewsCompiler(contextMock, options);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    context.assert.ok(result !== undefined, "Compilation result should not be undefined");
    context.assert.match(result.esmSource, /^export default class \w+ \{[\s\S]+renderAsync/, "Should export a named class with renderAsync");
});

test("ViewsCompiler: compiles all files and returns an array of compiled views", async (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: [TEST_FILE_PATH],
        projectRoot: "",
        projectType: ProjectType.Views
    };

    const compiler = new ViewsCompiler(contextMock, options);
    const results = await compiler.compileAll();

    context.assert.ok(results.length > 0);
    context.assert.strictEqual(results[0].filePath, TEST_FILE_PATH);
    context.assert.match(results[0].esmSource, /^export default class \w+ \{/);
});

test("ViewsCompiler: handles unsupported languages gracefully", async (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: ["unsupported.lang"],
        projectRoot: "",
        projectType: ProjectType.Views
    };

    const compiler = new ViewsCompiler(contextMock, options);
    const result = await compiler.compileFile("unsupported.lang");

    context.assert.ok(result.diagnostics!.length > 0);
    context.assert.strictEqual(result.diagnostics![0].message.message, "Unsupported language.");
});

test("ViewsCompiler: generates class names from file path and projectRoot (flat)", (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: [],
        projectRoot: "",
        projectType: ProjectType.Views
    };
    const compiler = new ViewsCompiler(contextMock, options);

    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("about.view.tshtml"), "AboutView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("about.tshtml"), "About");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("home-page.view.tshtml"), "HomePageView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("some.long.name_with.view.tshtml"), "SomeLongNameWithView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("some.long.name-with.view.tshtml"), "SomeLongNameWithView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("some.long.name.with.view.tshtml"), "SomeLongNameWithView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("crazy.some_view.file.tshtml"), "CrazySomeViewFile");
});

test("ViewsCompiler: generates class names from file path and projectRoot (with folders)", (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: [],
        projectRoot: "src/views",
        projectType: ProjectType.Views
    };
    const compiler = new ViewsCompiler(contextMock, options);

    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/about.view.tshtml"), "AboutView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/admin/user.view.tshtml"), "AdminUserView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/admin/some_name.view.tshtml"), "AdminSomeNameView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/deep/nest/path/file.view.tshtml"), "DeepNestPathFileView");
    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/other-pages/home.tshtml"), "OtherPagesHome");
});

test("ViewsCompiler: handles projectRoot with trailing slash", (context: TestContext) => {
    const contextMock = new MockCompilationContext();
    const options: IViewsCompilerOptions = {
        files: [],
        projectRoot: "src/views/",
        projectType: ProjectType.Views
    };
    const compiler = new ViewsCompiler(contextMock, options);

    context.assert.strictEqual(compiler["getClassNameFromFilePath"]("src/views/other-pages/home.tshtml"), "OtherPagesHome");
});