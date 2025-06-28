/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { ProjectType, ProjectTypeExtensions } from '../../src/models/project-type.ts';

test('ProjectType: length - success', (context: TestContext) => {
    const enumValues = Object.values(ProjectType).filter(x => typeof x === "string");

    context.assert.strictEqual(enumValues.length, 2);
});

test('ProjectType: value assignments', (context: TestContext) => {
    context.assert.strictEqual(ProjectType.API, "API");
    context.assert.strictEqual(ProjectType.Views, "Views");
});

test('ProjectTypeExtensions: toString - API', (context: TestContext) => {
    context.assert.strictEqual(ProjectTypeExtensions.toString(ProjectType.API), "API");
});

test('ProjectTypeExtensions: toString - Views', (context: TestContext) => {
    context.assert.strictEqual(ProjectTypeExtensions.toString(ProjectType.Views), "Views");
});

test('ProjectTypeExtensions: fromString - API', (context: TestContext) => {
    context.assert.strictEqual(ProjectTypeExtensions.fromString("API"), ProjectType.API);
    context.assert.strictEqual(ProjectTypeExtensions.fromString("api"), ProjectType.API);
});

test('ProjectTypeExtensions: fromString - Views', (context: TestContext) => {
    context.assert.strictEqual(ProjectTypeExtensions.fromString("Views"), ProjectType.Views);
    context.assert.strictEqual(ProjectTypeExtensions.fromString("views"), ProjectType.Views);
});

test('ProjectTypeExtensions: toString - fallback', (context: TestContext) => {
    const invalid = "" as ProjectType;
    
    context.assert.strictEqual(ProjectTypeExtensions.toString(invalid), null);
});

test('ProjectTypeExtensions: fromString - fallback', (context: TestContext) => {
    context.assert.strictEqual(ProjectTypeExtensions.fromString("unknown"), null);
    context.assert.strictEqual(ProjectTypeExtensions.fromString(""), null);
    context.assert.strictEqual(ProjectTypeExtensions.fromString("123"), null);
});