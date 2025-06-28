/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception, SystemException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { TextException } from '../../src/exceptions/text.exception.js';

test('TextException: constructor - success', (context: TestContext) => {
    const textName = 'TestText';
    const exception = new TextException(textName);

    context.assert.equal(exception.name, 'TextException');
    context.assert.equal(exception.message, textName);
    context.assert.ok(exception.stack);
    context.assert.ok(exception.stack.includes('TextException'));

    context.assert.ok(exception instanceof SystemException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);

    context.assert.equal(exception.toString(), `TextException: ${textName}`);
});