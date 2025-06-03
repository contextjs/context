# @contextjs/configuration-json

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/configuration-json)](https://www.npmjs.com/package/@contextjs/configuration-json)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> JSON-based configuration provider for ContextJS applications.

## Features

- Plug-and-play JSON configuration support
- Supports environment-specific configuration files
- Fully integrated with `@contextjs/configuration`
- Simple fluent API for loading files

## Installation

```bash
npm i @contextjs/configuration-json
```

## Quick Start

Example json configuration file `appsettings.json`:

```json
{
  "App": {
    "Port": 3000,
    "Name": "My Application"
  }
}
```

Code:

```typescript
import "@contextjs/configuration";
import "@contextjs/configuration-json";

import { Application, EnvironmentName } from "@contextjs/system";

const application = new Application();

application.useConfiguration(options => {
    options.useJsonConfiguration(json => {
        json.useFile("filepath/appsettings.json");
        json.useFile("filepath/appsettings.development.json", "development");
        json.useFile("filepath/appsettings.production.json", "production");
    });
});
application.environment.name = EnvironmentName.production;

const port = await application.configuration.getValueAsync("App:Port");
console.log(`Starting server on port ${port}...`);
```

## API Reference
For detailed API documentation, please refer to <a href="https://contextjs.dev/api/configuration-json#api-reference" target="_blank" rel="noopener noreferrer">API Reference</a>
<span style="font-size:0.75em;vertical-align:super;">↗️</span>