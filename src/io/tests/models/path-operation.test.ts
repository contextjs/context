/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { PathMapping } from "../../src/models/path-mapping.js";
import { PathOperationType } from "../../src/models/path-operation-type.js";
import { PathOperation } from "../../src/models/path-operation.js";

test("PathOperation: constructor assigns source, destination, and type", (context: TestContext) => {
    const pathOperation = new PathOperation("a.txt", "b.txt", PathOperationType.Copy);

    context.assert.strictEqual(pathOperation.source, "a.txt");
    context.assert.strictEqual(pathOperation.destination, "b.txt");
    context.assert.strictEqual(pathOperation.type, PathOperationType.Copy);
});

test("PathOperation: supports operation type Move", (context: TestContext) => {
    const pathOperation = new PathOperation("foo/bar.txt", "foo/baz.txt", PathOperationType.Move);

    context.assert.strictEqual(pathOperation.type, PathOperationType.Move);
    context.assert.strictEqual(pathOperation.source, "foo/bar.txt");
    context.assert.strictEqual(pathOperation.destination, "foo/baz.txt");
});

test("PathOperation: instance is instance of PathMapping", (context: TestContext) => {
    const pathOperation = new PathOperation("1", "2", PathOperationType.Copy);

    context.assert.ok(pathOperation instanceof PathOperation);
    context.assert.ok(pathOperation instanceof PathMapping);
});

test("PathOperation: allows unicode and special characters in paths", (context: TestContext) => {
    const pathOperation = new PathOperation("源/文件.txt", "目标/🎉.txt", PathOperationType.Copy);

    context.assert.strictEqual(pathOperation.source, "源/文件.txt");
    context.assert.strictEqual(pathOperation.destination, "目标/🎉.txt");
    context.assert.strictEqual(pathOperation.type, PathOperationType.Copy);
});

test("PathOperation: type can be set to any valid PathOperationType", (context: TestContext) => {
    const types = [PathOperationType.Copy, PathOperationType.Move];

    for (const type of types) {
        const pathOperation = new PathOperation("x", "y", type);
        context.assert.strictEqual(pathOperation.type, type);
    }
});