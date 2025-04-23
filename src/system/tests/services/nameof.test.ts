/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { InvalidExpressionException } from "../../src/exceptions/invalid-expression.exception.js";
import { nameof } from "../../src/services/nameof.js";

interface Sample { firstName: string; age: number; }

test("nameof: returns key from string literal", (context: TestContext) => {
    context.assert.strictEqual(nameof<Sample>("firstName"), "firstName");
    context.assert.strictEqual(nameof<Sample>("age"), "age");
});

test("nameof: extracts property name from lambda", (context: TestContext) => {
    const sample: Sample = { firstName: "John", age: 42 };
    context.assert.strictEqual(nameof(() => sample.firstName), "firstName");
    context.assert.strictEqual(nameof(() => sample.age), "age");
});

test("nameof: throws on invalid expression", (context: TestContext) => {
    context.assert.throws(() => nameof(() => 123), InvalidExpressionException);
    context.assert.throws(() => nameof(() => null), InvalidExpressionException);
});
