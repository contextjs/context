/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Unauthorized } from '../../src/results/unauthorized-result.js';

class MockResponse {
    statusCode?: number;
    statusMessage?: string;
    endCalled = false;
    setStatusCalled = false;
    setHeaderCalled = false;
    headers: Record<string, string> = {};

    setStatus(code: number, message: string) {
        this.statusCode = code;
        this.statusMessage = message;
        this.setStatusCalled = true;
        return this;
    }
    setHeader(name: string, value: string) {
        this.headers[name] = value;
        this.setHeaderCalled = true;
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

test('Unauthorized: returns an IActionResult', (context: TestContext) => {
    const result = Unauthorized();
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('UnauthorizedResult: executeAsync sets 401 status and ends response', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Unauthorized();

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 401);
    context.assert.strictEqual(mockContext.response.statusMessage, "Unauthorized");
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.endCalled, true);
});

test('UnauthorizedResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async endAsync() {
            throw new Error("End error");
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = Unauthorized();

    await context.assert.rejects(() => result.executeAsync(mockContext as any), { message: "End error" });
});