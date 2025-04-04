/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IncomingMessage, ServerResponse } from "node:http";
import { test, TestContext } from 'node:test';
import '../../src/extensions/application-extensions.js';
import { HttpContext } from "../../src/http-context.js";
import { HttpRequest } from "../../src/http-request.js";
import { HttpResponse } from "../../src/http-response.js";
import { IHttpContext } from "../../src/models/interfaces/i-http-context.js";
import { IHttpRequest } from "../../src/models/interfaces/i-http-request.js";
import { IHttpResponse } from "../../src/models/interfaces/i-http-response.js";

test('constructor', (context: TestContext) => {
    const incomingMessage: IncomingMessage = new IncomingMessage(null!);
    incomingMessage.headers.host = 'localhost';
    const httpRequest: IHttpRequest = new HttpRequest(incomingMessage);
    const httpResponse: IHttpResponse = new HttpResponse({} as ServerResponse) as IHttpResponse;
    const httpContext: IHttpContext = new HttpContext(httpRequest, httpResponse);

    context.assert.strictEqual(httpContext.request, httpRequest);
    context.assert.strictEqual(httpContext.response, httpResponse);
});