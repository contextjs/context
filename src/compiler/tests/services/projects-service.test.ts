/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import path from "node:path";
import test, { TestContext } from "node:test";
import { ProjectsService } from "../../src/services/projects.service.js";
import { fileURLToPath } from "node:url";

test("ProjectsService: getSourceFiles - returns all .ts files in src", (context: TestContext) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDataPath = path.resolve(__dirname, "../test-data");

    const files = ProjectsService.getSourceFiles(testDataPath);

    context.assert.ok(Array.isArray(files));
    context.assert.ok(files.length > 0);
    context.assert.ok(files.every(file => file.endsWith(".ts")));
});

test("ProjectsService: getParsedConfig - returns valid tsconfig", (context: TestContext) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDataPath = path.resolve(__dirname, "../test-data");
    
    const parsed = ProjectsService.getParsedConfig(testDataPath);

    context.assert.ok(parsed);
    context.assert.ok(parsed.options);
    context.assert.strictEqual(typeof parsed.options.strict, "boolean");
    context.assert.ok(Array.isArray(parsed.fileNames));
    context.assert.ok(parsed.fileNames.length > 0);
});

test("ProjectsService: getParsedConfig - throws if tsconfig.json is missing", (context: TestContext) => {
    const missingPath = path.resolve("tests/stubs/missing-project");

    context.assert.throws(() => ProjectsService.getParsedConfig(missingPath));
});