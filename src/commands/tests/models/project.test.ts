/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { Project } from "../../src/models/project.js";

test("Project: constructor assigns name and path", (context: TestContext) => {
    const project = new Project("demo", "/home/demo");

    context.assert.strictEqual(project.name, "demo");
    context.assert.strictEqual(project.path, "/home/demo");
});

test("Project: different instances are independent", (context: TestContext) => {
    const project1 = new Project("a", "/a");
    const project2 = new Project("b", "/b");

    context.assert.strictEqual(project1.name, "a");
    context.assert.strictEqual(project2.name, "b");
    context.assert.notStrictEqual(project1, project2);
});

test("Project: allows falsy and unusual names/paths", (context: TestContext) => {
    const project = new Project("", "");
    context.assert.strictEqual(project.name, "");
    context.assert.strictEqual(project.path, "");
    
    const project2 = new Project(undefined as any, null as any);
    context.assert.strictEqual(project2.name, undefined);
    context.assert.strictEqual(project2.path, null);
});