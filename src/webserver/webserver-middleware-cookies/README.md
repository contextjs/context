# @contextjs/webserver-middleware-cookies

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-cookies?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-cookies)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Middleware for ContextJS WebServer that transparently handles HTTP cookies in requests and responses.

## Installation

```bash
npm i @contextjs/webserver-middleware-cookies
```

## Features

* **Automatic Parsing**: Reads the `Cookie` header and populates `context.request.cookies` with a `CookieCollection` of `Cookie` objects.
* **Response Management**: Collects cookies you add to `context.response.cookies` and emits proper `Set-Cookie` headers at the end of each request.
* **Full Cookie Options**: Support for domain, path, expires, max-age, secure, HttpOnly, and SameSite attributes.
* **OOP & Async**: Built as a modern, promise-based middleware compatible with the ContextJS ecosystem.

## Usage

First, register the middleware alongside your web server options:

```typescript
import "@contextjs/webserver-middleware-cookies";

import { Application } from "@contextjs/system";
import { HttpContext, WebServerOptions } from "@contextjs/webserver";
import { Cookie, CookieOptions, SameSiteMode } from "@contextjs/webserver-middleware-cookies";

const app = new Application();

app.useWebServer((options: WebServerOptions) => {
    options.onEvent = e => console.log(`[WebServer:${e.type}]`, e.detail);
    options
        .useCookies()
        .useMiddleware({
            name: "logger",
            version: "1.0.0",
            async onRequest(context: HttpContext) {
                const sessionCookie = context.request.cookies.get("session");
                console.log("Session:", sessionCookie?.value);

                const cookieOptions = new CookieOptions("localhost", "/", null, true, SameSiteMode.Lax, true, null);
                const cookie = new Cookie("session", "abc123", cookieOptions);
                context.response.cookies.set("session", cookie);

                return await context.response
                    .setHeader("Content-Type", "text/plain")
                    .sendAsync("Hello, ContextJS!");
            }
        });
});

await app.runAsync();
```
## API Reference
For detailed API documentation, please refer to <a href="https://contextjs.dev/api/webserver-middleware-cookies#api-reference" target="_blank" rel="noopener noreferrer">API Reference</a>
<span style="font-size:0.75em;vertical-align:super;">↗️</span>