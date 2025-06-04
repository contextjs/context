/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Forbidden } from '../../src/results/forbidden-result.js';

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

test('Forbidden: returns an IActionResult', (context: TestContext) => {
    const result = Forbidden();
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('ForbiddenResult: executeAsync sets 403 status and ends response', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Forbidden();

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 403);
    context.assert.strictEqual(mockContext.response.statusMessage, "Forbidden");
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.endCalled, true);
});

test('ForbiddenResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async endAsync() {
            throw new Error("End error");
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = Forbidden();

    await context.assert.rejects(() => result.executeAsync(mockContext as any), { message: "End error" });
});