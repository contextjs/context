/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Json } from '../../src/results/json-result.js';

class MockResponse {
    statusCode?: number;
    statusMessage?: string;
    headers: Record<string, string> = {};
    sentValue?: string;
    setStatusCalled = false;
    setHeaderCalled = false;
    sendCalled = false;
    endCalled = false;

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
    async sendAsync(value: string) {
        this.sentValue = value;
        this.sendCalled = true;
        return Promise.resolve();
    }
    async endAsync() {
        this.endCalled = true;
        return Promise.resolve();
    }
}

class MockHttpContext {
    response = new MockResponse();
}

test('Json: returns an IActionResult', (context: TestContext) => {
    const result = Json({ x: 1 });
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('JsonResult: executeAsync sends JSON when value is present', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const value = { hello: "world" };
    const result = Json(value);

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 200);
    context.assert.strictEqual(mockContext.response.statusMessage, "OK");
    context.assert.strictEqual(mockContext.response.headers['Content-Type'], 'application/json');
    context.assert.strictEqual(mockContext.response.sentValue, JSON.stringify(value));
    context.assert.strictEqual(mockContext.response.sendCalled, true);
});

test('JsonResult: executeAsync delegates to NoContent when value is null', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Json(null);

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 204);
    context.assert.strictEqual(mockContext.response.endCalled, true);
    context.assert.strictEqual(mockContext.response.sentValue, undefined);
});

test('JsonResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async sendAsync(value: string) {
            throw new Error('Send error');
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = Json({ fail: true });

    await context.assert.rejects(() => result.executeAsync(mockContext as any), {
        message: 'Send error'
    });
});