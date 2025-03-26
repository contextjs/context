/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ProjectType } from '@contextjs/core';
import test, { TestContext } from 'node:test';
import { APITemplatesService } from '../../../src/services/templates/api-templates.service.ts';
import { TemplatesServiceResolver } from '../../../src/services/templates/templates-service-resolver.ts';

test('TemplateServiceResolver: resolveAsync - success', async (context: TestContext) => {

    const projectType = ProjectType.API;
    const service = await TemplatesServiceResolver.resolveAsync(projectType);

    context.assert.ok(service instanceof APITemplatesService);
    context.assert.ok(service);
});

test('TemplateServiceResolver: resolveAsync - null', async (context: TestContext) => {
    const service = await TemplatesServiceResolver.resolveAsync(-1);

    context.assert.strictEqual(service, null);
});