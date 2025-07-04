/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from '../../src/models/file-template.js';

test('FileTemplate: constructor assigns name and content', (context: TestContext) => {
    const template = new FileTemplate('test.txt', 'hello');
    
    context.assert.strictEqual(template.name, 'test.txt');
    context.assert.strictEqual(template.content, 'hello');
});