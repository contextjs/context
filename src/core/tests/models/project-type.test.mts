/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ProjectType } from '../../src/models/project-type.js';

test('ProjectType: length - success', (context: TestContext) => {
    context.assert.strictEqual(Object.keys(ProjectType).length / 2, 1);
});

test('ProjectType: toString - success', (context: TestContext) => {
    context.assert.strictEqual(ProjectType.API, 0);
});