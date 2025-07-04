/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Project } from '../../src/models/project.js';

test('Project: constructor assigns name and path', (context: TestContext) => {
    const project = new Project('MyProject', '/projects/my');
    
    context.assert.strictEqual(project.name, 'MyProject');
    context.assert.strictEqual(project.path, '/projects/my');
});