/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { NoContent } from '../../src/results/no-content-result.js';

class MockResponse {
    statusCode?: number;
    statusMessage?: string;
    endCalled = false;
    setStatusCalled = false;

    setStatus(code: number, message: string) {
        this.statusCode = code;
        this.statusMessage = message;
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


test('NoContent: returns an IActionResult implementation', (context: TestContext) => {
    const result = NoContent();

    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});


test('NoContentResult: executeAsync sets 204 status and ends response', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = NoContent();

    const returnValue = await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 204);
    context.assert.strictEqual(mockContext.response.statusMessage, "No Content");
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.endCalled, true);
    context.assert.strictEqual(returnValue, undefined);
});

test('NoContentResult: executeAsync propagates errors from endAsync', async (context: TestContext) => {
    class ErrorResponse extends MockResponse { async endAsync() { throw new Error("Test end error"); } }
    const mockContext = { response: new ErrorResponse() };
    const result = NoContent();

    await context.assert.rejects(() => result.executeAsync(mockContext as any), { message: "Test end error" });
});