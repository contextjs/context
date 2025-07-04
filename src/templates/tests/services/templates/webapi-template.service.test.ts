/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from '../../../src/models/file-template.js';
import { WebAPITemplateService } from '../../../src/services/templates/webapi-template.service.js';

test('WebAPITemplateService: templates property contains all expected templates', (context: TestContext) => {
    const service = new WebAPITemplateService();

    context.assert.ok(Array.isArray(service.templates));
    context.assert.strictEqual(service.templates.length, 11);

    for (const template of service.templates) {
        context.assert.ok(template instanceof FileTemplate);
        context.assert.ok(typeof template.name === 'string');
    }
});