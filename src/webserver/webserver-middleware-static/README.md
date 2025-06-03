# @contextjs/webserver-middleware-static

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-static?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-static)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Static files middleware for the ContextJS webserver.

## Installation

```bash
npm i @contextjs/webserver-middleware-static
```

## Usage

```typescript
import "@contextjs/webserver-middleware-static";

import { Application } from "@contextjs/system";
import { WebServerOptions } from "@contextjs/webserver";
import { StaticFilesOptions } from "@contextjs/webserver-middleware-static";

const application = new Application();

application.useWebServer((options: WebServerOptions) => {
    options.onEvent = e => console.log(`[WebServer:${e.type}]`, e.detail);
    options.useStaticFiles((staticFilesOptions: StaticFilesOptions) => {
        staticFilesOptions.publicFolder = "your-static-files_folder";
        staticFilesOptions.fileExtensions = ["png", "jpg", "jpeg", "gif"]; // Only allow these file types
        // staticFilesOptions.fileExtensions = []; // Uncomment to allow all file types
    });
});

await application.runAsync();
```

## API Reference
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/webserver-middleware-static#api-reference).