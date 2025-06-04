/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Empty } from '../../src/results/empty-result.js';

class MockResponse {
    endCalled = false;
    setStatusCalled = false;
    setStatus() {
        this.setStatusCalled = true;
        return this;
    }
    async endAsync() {
        this.endCalled = true;
        return Promise.resolve();
    }
}
class MockHttpContext {
    response = new MockResponse();
}

test('Empty returns an IActionResult', (context: TestContext) => {
    const result = Empty();

    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('EmptyResult: executeAsync ends the response only', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Empty();

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.endCalled, true);
    context.assert.strictEqual(mockContext.response.setStatusCalled, false);
});

test('EmptyResult: executeAsync propagates errors from endAsync', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async endAsync() {
            throw new Error("End error");
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = Empty();

    await context.assert.rejects(() => result.executeAsync(mockContext as any), { message: "End error" });
});