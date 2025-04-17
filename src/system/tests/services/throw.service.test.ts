/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { NullReferenceException } from "../../src/exceptions/null-reference.exception.ts";
import { Throw } from "../../src/services/throw.service.ts";
import { StringExtensions } from '../../src/extensions/string.extensions.ts';

test('Throw: ifNull - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Throw.ifNull(null), NullReferenceException);
});

test('Throw: ifNull - does not throw on valid object', (context: TestContext) => {
    context.assert.doesNotThrow(() => Throw.ifNull({}));
});

test('Throw: ifNullOrUndefined - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Throw.ifNullOrUndefined(null), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrUndefined(undefined), NullReferenceException);
});

test('Throw: ifNullOrUndefined - does not throw on defined value', (context: TestContext) => {
    context.assert.doesNotThrow(() => Throw.ifNullOrUndefined('contextjs'));
});

test('Throw: ifNullOrEmpty - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Throw.ifNullOrEmpty(null), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrEmpty(undefined), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrEmpty(StringExtensions.empty), NullReferenceException);
});

test('Throw: ifNullOrEmpty - does not throw on valid string', (context: TestContext) => {
    context.assert.doesNotThrow(() => Throw.ifNullOrEmpty('contextjs'));
});

test('Throw: ifNullOrWhiteSpace - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => Throw.ifNullOrWhiteSpace(null), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrWhiteSpace(undefined), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrWhiteSpace(StringExtensions.empty), NullReferenceException);
    context.assert.throws(() => Throw.ifNullOrWhiteSpace(' '), NullReferenceException);
});

test('Throw: ifNullOrWhiteSpace - does not throw on non-empty string', (context: TestContext) => {
    context.assert.doesNotThrow(() => Throw.ifNullOrWhiteSpace('contextjs'));
});