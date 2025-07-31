/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { FilePathOperation } from "../../src/models/file-path-operation.js";
import { PathMapping } from "../../src/models/path-mapping.js";
import { PathOperationType } from "../../src/models/path-operation-type.js";
import { PathOperation } from "../../src/models/path-operation.js";

test("FilePathOperation: constructs with all PathOperation fields", (context: TestContext) => {
    const filePathOperation = new FilePathOperation("src/file.txt", "dist/file.txt", PathOperationType.Copy);

    context.assert.strictEqual(filePathOperation.source, "src/file.txt");
    context.assert.strictEqual(filePathOperation.destination, "dist/file.txt");
    context.assert.strictEqual(filePathOperation.type, PathOperationType.Copy);
});

test("FilePathOperation: instance of FilePathOperation, PathOperation, and PathMapping", (context: TestContext) => {
    const filePathOperation = new FilePathOperation("a", "b", PathOperationType.Move);

    context.assert.ok(filePathOperation instanceof FilePathOperation);
    context.assert.ok(filePathOperation instanceof PathOperation);
    context.assert.ok(filePathOperation instanceof PathMapping);
});

test("FilePathOperation: allows unicode and special characters", (context: TestContext) => {
    const filePathOperation = new FilePathOperation("файл.txt", "目的/🎉.txt", PathOperationType.Move);

    context.assert.strictEqual(filePathOperation.source, "файл.txt");
    context.assert.strictEqual(filePathOperation.destination, "目的/🎉.txt");
    context.assert.strictEqual(filePathOperation.type, PathOperationType.Move);
});