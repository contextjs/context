/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { PathOperationType } from "../../src/models/path-operation-type.js";

test("PathOperationType: enum contains Copy and Move", (context: TestContext) => {
    context.assert.strictEqual(PathOperationType.Copy, "copy");
    context.assert.strictEqual(PathOperationType.Move, "move");
});

test("PathOperationType: enum values are unique", (context: TestContext) => {
    context.assert.notStrictEqual(PathOperationType.Copy, PathOperationType.Move);
});

test("PathOperationType: can be used in switch/case statements", (context: TestContext) => {
    function getActionDescription(operationType: PathOperationType): string {
        switch (operationType) {
            case PathOperationType.Copy:
                return "Copy operation";
            case PathOperationType.Move:
                return "Move operation";
            default:
                return "Unknown";
        }
    }
    context.assert.strictEqual(getActionDescription(PathOperationType.Copy), "Copy operation");
    context.assert.strictEqual(getActionDescription(PathOperationType.Move), "Move operation");
});

test("PathOperationType: enum supports round-trip serialization", (context: TestContext) => {
    const operationType: PathOperationType = PathOperationType.Copy;
    const serialized = JSON.stringify({ operationType: operationType });
    const deserialized = JSON.parse(serialized);

    context.assert.strictEqual(deserialized.operationType, PathOperationType.Copy);
});

test("PathOperationType: values are assignable from string (type-cast)", (context: TestContext) => {
    const value: string = "move";
    const operationType: PathOperationType = value as PathOperationType;

    context.assert.strictEqual(operationType, PathOperationType.Move);
});