/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { NullReferenceException } from "../../src/exceptions/null-reference.exception.ts";
import { Throw } from "../../src/services/throw.service.ts";
import { StringExtensions } from '../../src/extensions/string.extensions.ts';

test('Throw: ifNull - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => { Throw.ifNull(null) }, new NullReferenceException());
});

test('Throw: ifNullOrUndefined - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => { Throw.ifNullOrUndefined(null) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrUndefined(undefined) }, new NullReferenceException());
});

test('Throw: ifNullOrEmpty - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => { Throw.ifNullOrEmpty(null) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrEmpty(undefined) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrEmpty(StringExtensions.empty) }, new NullReferenceException());
});

test('Throw: ifNullOrWhiteSpace - throws NullReferenceException', (context: TestContext) => {
    context.assert.throws(() => { Throw.ifNullOrWhiteSpace(null) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrWhiteSpace(undefined) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrWhiteSpace(StringExtensions.empty) }, new NullReferenceException());
    context.assert.throws(() => { Throw.ifNullOrWhiteSpace(' ') }, new NullReferenceException());
});