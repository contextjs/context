/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { TransformersService } from "../../src/services/transformers.service.js";

test("TransformersService: merge - combines before and after arrays", (context: TestContext) => {
    const transformerA = () => (sourceFile => sourceFile);
    const transformerB = () => (sourceFile => sourceFile);

    const result = TransformersService.merge(
        { before: [transformerA], after: [transformerB] },
        { before: [transformerB], after: [transformerA] }
    );

    context.assert.strictEqual(result.before?.length, 2);
    context.assert.strictEqual(result.after?.length, 2);
});

test("TransformersService: merge - handles null a.before/after", (context: TestContext) => {
    const transformer = () => (sourceFile => sourceFile);

    const result = TransformersService.merge(
        { before: null, after: null },
        { before: [transformer], after: [transformer] }
    );

    context.assert.strictEqual(result.before?.length, 1);
    context.assert.strictEqual(result.after?.length, 1);
});

test("TransformersService: merge - returns undefined if all empty", (context: TestContext) => {
    const result = TransformersService.merge({ before: null, after: null });

    context.assert.strictEqual(result.before, undefined);
    context.assert.strictEqual(result.after, undefined);
});