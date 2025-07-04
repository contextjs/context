/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from '../../../src/models/file-template.js';
import { TemplateService } from '../../../src/services/templates/template.service.js';

class TestTemplateService extends TemplateService {
    public templates: FileTemplate[] = [
        new FileTemplate('test.txt', 'hello')
    ];
}

test('TemplateService: subclass must implement templates property', (context: TestContext) => {
    const service = new TestTemplateService();

    context.assert.strictEqual(service.templates[0].name, 'test.txt');
    context.assert.strictEqual(service.templates[0].content, 'hello');
});
