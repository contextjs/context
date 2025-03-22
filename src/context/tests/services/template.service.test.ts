/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ProjectType, StringExtensions } from '@contextjs/core';
import test, { TestContext } from 'node:test';
import { TemplateService } from '../../src/services/template.service.ts';

test('TemplateService: fromProjectType - success', (context: TestContext) => {
    const fileTemplate = TemplateService.api;
    const result = TemplateService.fromProjectType(ProjectType.API);

    context.assert.strictEqual(result, fileTemplate);
});

test('TemplateService: fromProjectType - failure', (context: TestContext) => {
    const result = TemplateService.fromProjectType(null!);

    context.assert.strictEqual(result.length, 0);
});

test('TemplateService: fromProjectType - unknown', (context: TestContext) => {
    const result = TemplateService.fromProjectType(20);

    context.assert.strictEqual(result.length, 0);
});