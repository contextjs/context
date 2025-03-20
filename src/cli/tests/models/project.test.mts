/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Project } from "../../src/models/project.mjs";

test('Project: constructor - success', (context: TestContext) => {
    const name = 'MyProject';
    const path = '/path/to/project';
    const project = new Project(name, path);

    context.assert.strictEqual(project.name, name);
    context.assert.strictEqual(project.path, path);
});