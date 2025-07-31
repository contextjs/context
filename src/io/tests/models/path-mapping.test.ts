/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { PathMapping } from "../../src/models/path-mapping.js";

test("PathMapping: constructor assigns source and destination", (context: TestContext) => {
    const mapping = new PathMapping("a.txt", "b.txt");

    context.assert.strictEqual(mapping.source, "a.txt");
    context.assert.strictEqual(mapping.destination, "b.txt");
});

test("PathMapping: allows absolute and relative paths", (context: TestContext) => {
    const abs = new PathMapping("/usr/data/file.txt", "/usr/backup/file.txt");
    const rel = new PathMapping("src/foo", "dist/foo");

    context.assert.strictEqual(abs.source, "/usr/data/file.txt");
    context.assert.strictEqual(abs.destination, "/usr/backup/file.txt");

    context.assert.strictEqual(rel.source, "src/foo");
    context.assert.strictEqual(rel.destination, "dist/foo");
});

test("PathMapping: allows empty strings (edge case)", (context: TestContext) => {
    const mapping = new PathMapping("", "");
    context.assert.strictEqual(mapping.source, "");
    context.assert.strictEqual(mapping.destination, "");
});

test("PathMapping: supports unicode and special characters", (context: TestContext) => {
    const mapping = new PathMapping("𝓼𝓸𝓾𝓻𝓬𝓮-文件.txt", "目标/🎉.txt");

    context.assert.strictEqual(mapping.source, "𝓼𝓸𝓾𝓻𝓬𝓮-文件.txt");
    context.assert.strictEqual(mapping.destination, "目标/🎉.txt");
});