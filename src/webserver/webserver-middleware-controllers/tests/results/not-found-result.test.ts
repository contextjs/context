/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { NotFound } from '../../src/results/not-found-result.js';

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


test('NotFound returns an IActionResult', (context: TestContext) => {
    const result = NotFound();
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('NotFoundResult: executeAsync sets 404 status and ends response', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = NotFound();

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 404);
    context.assert.strictEqual(mockContext.response.statusMessage, "Not Found");
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.endCalled, true);
});

test('NotFoundResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async endAsync() {
            throw new Error("End error");
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = NotFound();

    await context.assert.rejects(() => result.executeAsync(mockContext as any), { message: "End error" });
});
