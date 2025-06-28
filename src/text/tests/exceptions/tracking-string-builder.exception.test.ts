/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception, SystemException } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { TrackingStringBuilderException } from '../../src/exceptions/tracking-string-builder.exception.js';

test('TrackingStringBuilderException: constructor - success', (context: TestContext) => {
    const textName = 'TestText';
    const exception = new TrackingStringBuilderException(textName);

    context.assert.equal(exception.name, 'TrackingStringBuilderException');
    context.assert.equal(exception.message, textName);
    context.assert.ok(exception.stack);
    context.assert.ok(exception.stack.includes('TrackingStringBuilderException'));

    context.assert.ok(exception instanceof SystemException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);

    context.assert.equal(exception.toString(), `TrackingStringBuilderException: ${textName}`);
});