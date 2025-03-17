/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ProjectType } from "../../src/models/project-type.mjs";
import { ProjectTypeService } from "../../src/services/project-type.service.mjs";
import { StringExtensions } from '../../src/extensions/string.extensions.mts';

test('ProjectTypeService: toString - success', (context: TestContext) => {
    let result = ProjectTypeService.toString(ProjectType.WebAPI);
    context.assert.strictEqual(result, "Web API");

    result = ProjectTypeService.toString(null!);
    context.assert.strictEqual(result, null);
});

test('ProjectTypeService: fromString - success', (context: TestContext) => {
    let result = ProjectTypeService.fromString("api");
    context.assert.strictEqual(result, ProjectType.WebAPI);

    result = ProjectTypeService.fromString("webapi");
    context.assert.strictEqual(result, ProjectType.WebAPI);

    result = ProjectTypeService.fromString("invalid");
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromString(StringExtensions.empty);
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromString(null!);
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromString(undefined!);
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromString(" ");
    context.assert.strictEqual(result, null);
});

test('ProjectTypeService: fromNumber - success', (context: TestContext) => {
    let result = ProjectTypeService.fromNumber(0);
    context.assert.strictEqual(result, ProjectType.WebAPI);

    result = ProjectTypeService.fromNumber(2000);
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromNumber(null!);
    context.assert.strictEqual(result, null);

    result = ProjectTypeService.fromNumber(undefined!);
    context.assert.strictEqual(result, null);
});

test('ProjectTypeService: toCliOptions - success', (context: TestContext) => {
    let result = ProjectTypeService.toCLIOptions();

    context.assert.strictEqual(result.length, 1);
    context.assert.strictEqual(result[0], "  Web API [0]");
});