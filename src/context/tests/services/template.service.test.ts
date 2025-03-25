/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from '../../src/models/file-template.js';
import { TemplatesService } from '../../src/services/templates/templates.service.js';

test('TemplateService: instance - success', (context: TestContext) => {
    class TestTemplatesService extends TemplatesService {
        protected helpText: string;
        public displayHelpAsync(): Promise<void> {
            throw new Error('Method not implemented.');
        }
        public templates: FileTemplate[];

        public constructor() {
            super();
            this.helpText = 'Help text';
            this.templates = [{ name: 'test', content: 'test' }];
        }
    }

    const service = new TestTemplatesService();

    context.assert.strictEqual((service as any).helpText, 'Help text');
    context.assert.throws(() => service.displayHelpAsync(), { message: 'Method not implemented.' });
    context.assert.deepEqual((service as any).templates, [{ name: 'test', content: 'test' }]);
});