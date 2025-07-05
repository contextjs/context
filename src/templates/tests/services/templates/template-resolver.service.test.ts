/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { TemplateResolverService } from '../../../src/services/templates/template-resolver.service.js';
import { WebAPITemplateService } from '../../../src/services/templates/webapi-template.service.js';

test('TemplateResolverService: resolveAsync - resolves webapi template', async (context: TestContext) => {
    const result = await TemplateResolverService.resolveAsync('webapi');

    context.assert.ok(result instanceof WebAPITemplateService);
});

test('TemplateResolverService: resolveAsync - returns null for unknown template type', async (context: TestContext) => {
    const result = await TemplateResolverService.resolveAsync('unknown');

    context.assert.strictEqual(result, null);
});

test('TemplateResolverService: resolveAsync - returns null for empty type', async (context: TestContext) => {
    const result = await TemplateResolverService.resolveAsync('');
    
    context.assert.strictEqual(result, null);
});