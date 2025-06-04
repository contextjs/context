/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { BadRequest } from '../../src/results/bad-request-result.js';

class MockResponse {
    statusCode?: number;
    statusMessage?: string;
    endCalled = false;
    setStatusCalled = false;
    setHeaderCalled = false;
    sendCalled = false;
    sentValue?: string;
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
    async sendAsync(value: string) {
        this.sendCalled = true;
        this.sentValue = value;
        return Promise.resolve();
    }
}
class MockHttpContext {
    response = new MockResponse();
}

test('BadRequest: returns an IActionResult', (context: TestContext) => {
    const result = BadRequest();
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('BadRequestResult: executeAsync sets 400 and ends response with no message', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = BadRequest();

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 400);
    context.assert.strictEqual(mockContext.response.statusMessage, "Bad Request");
    context.assert.strictEqual(mockContext.response.endCalled, true);
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.setHeaderCalled, false);
    context.assert.strictEqual(mockContext.response.sendCalled, false);
    context.assert.strictEqual(mockContext.response.sentValue, undefined);
});

test('BadRequestResult: executeAsync sends body when message is provided', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = BadRequest("Invalid input");

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 400);
    context.assert.strictEqual(mockContext.response.statusMessage, "Bad Request");
    context.assert.strictEqual(mockContext.response.headers["Content-Type"], "text/plain; charset=utf-8");
    context.assert.strictEqual(mockContext.response.sentValue, "Invalid input");
    context.assert.strictEqual(mockContext.response.sendCalled, true);
    context.assert.strictEqual(mockContext.response.setHeaderCalled, true);
    context.assert.strictEqual(mockContext.response.endCalled, false);
});

test('BadRequestResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async sendAsync(value: string) {
            throw new Error("Send error");
        }
        async endAsync() {
            throw new Error("End error");
        }
    }

    const mockContext1 = { response: new ErrorResponse() };
    const result1 = BadRequest();
    await context.assert.rejects(() => result1.executeAsync(mockContext1 as any), { message: "End error" });

    const mockContext2 = { response: new ErrorResponse() };
    const result2 = BadRequest("fail");
    await context.assert.rejects(() => result2.executeAsync(mockContext2 as any), { message: "Send error" });
});

test('BadRequestResult: executeAsync treats whitespace as no message', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = BadRequest("   "); // whitespace only

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 400);
    context.assert.strictEqual(mockContext.response.statusMessage, "Bad Request");
    context.assert.strictEqual(mockContext.response.endCalled, true);
    context.assert.strictEqual(mockContext.response.setHeaderCalled, false);
    context.assert.strictEqual(mockContext.response.sendCalled, false);
});