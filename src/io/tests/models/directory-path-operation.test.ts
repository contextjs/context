/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { DirectoryPathOperation } from "../../src/models/directory-path-operation.js";
import { PathMapping } from "../../src/models/path-mapping.js";
import { PathOperationType } from "../../src/models/path-operation-type.js";
import { PathOperation } from "../../src/models/path-operation.js";

test("DirectoryPathOperation: constructs with all PathOperation fields", (context: TestContext) => {
    const directoryPathOperation = new DirectoryPathOperation("src/dir", "dist/dir", PathOperationType.Copy);

    context.assert.strictEqual(directoryPathOperation.source, "src/dir");
    context.assert.strictEqual(directoryPathOperation.destination, "dist/dir");
    context.assert.strictEqual(directoryPathOperation.type, PathOperationType.Copy);
});

test("DirectoryPathOperation: instance of DirectoryPathOperation, PathOperation, and PathMapping", (context: TestContext) => {
    const directoryPathOperation = new DirectoryPathOperation("from", "to", PathOperationType.Move);

    context.assert.ok(directoryPathOperation instanceof DirectoryPathOperation);
    context.assert.ok(directoryPathOperation instanceof PathOperation);
    context.assert.ok(directoryPathOperation instanceof PathMapping);
});

test("DirectoryPathOperation: allows unicode and special characters", (context: TestContext) => {
    const directoryPathOperation = new DirectoryPathOperation("源/目录", "目标/🎉", PathOperationType.Move);

    context.assert.strictEqual(directoryPathOperation.source, "源/目录");
    context.assert.strictEqual(directoryPathOperation.destination, "目标/🎉");
    context.assert.strictEqual(directoryPathOperation.type, PathOperationType.Move);
});