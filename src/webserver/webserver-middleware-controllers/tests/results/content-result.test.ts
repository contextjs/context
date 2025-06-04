/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Content } from '../../src/results/content-result.js';

class MockResponse {
    statusCode?: number;
    statusMessage?: string;
    headers: Record<string, string> = {};
    sentValue?: string;
    setStatusCalled = false;
    setHeaderCalled = false;
    sendCalled = false;

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
}

class MockHttpContext {
    response = new MockResponse();
}

test('Content: returns an IActionResult', (context: TestContext) => {
    const result = Content("hi");
    context.assert.ok(result);
    context.assert.strictEqual(typeof result.executeAsync, 'function');
});

test('ContentResult: executeAsync sends content with defaults', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Content("hello");

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 200);
    context.assert.strictEqual(mockContext.response.statusMessage, "OK");
    context.assert.strictEqual(mockContext.response.headers["Content-Type"], "text/plain; charset=utf-8");
    context.assert.strictEqual(mockContext.response.sentValue, "hello");
    context.assert.strictEqual(mockContext.response.setStatusCalled, true);
    context.assert.strictEqual(mockContext.response.setHeaderCalled, true);
    context.assert.strictEqual(mockContext.response.sendCalled, true);
});

test('ContentResult: executeAsync sends custom contentType and status', async (context: TestContext) => {
    const mockContext = new MockHttpContext();
    const result = Content("<b>Hi</b>", "text/html", 201, "Created");

    await result.executeAsync(mockContext as any);

    context.assert.strictEqual(mockContext.response.statusCode, 201);
    context.assert.strictEqual(mockContext.response.statusMessage, "Created");
    context.assert.strictEqual(mockContext.response.headers["Content-Type"], "text/html");
    context.assert.strictEqual(mockContext.response.sentValue, "<b>Hi</b>");
});

test('ContentResult: executeAsync propagates errors', async (context: TestContext) => {
    class ErrorResponse extends MockResponse {
        async sendAsync(value: string) {
            throw new Error("Send error");
        }
    }
    const mockContext = { response: new ErrorResponse() };
    const result = Content("fail");

    await context.assert.rejects(() => result.executeAsync(mockContext as any), {
        message: "Send error"
    });
});