# @contextjs/configuration

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/configuration?cache=300)](https://www.npmjs.com/package/@contextjs/configuration)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Lightweight configuration system for ContextJS applications, featuring async providers and environment variable support.

## Features

- Fluent API for configuring providers
- Async-based configuration loading
- Support for environment variables
- Pluggable provider model
- Seamless integration with `Application` via `.useConfiguration()`

## Installation

```bash
npm i @contextjs/configuration
```

## Quick Start

```ts
import { Application } from "@contextjs/system";
import "@contextjs/configuration";

const app = new Application();

app.useConfiguration(options => {
    options.useEnvironmentVariables();
    options.useProvider({
        async getValueAsync(key) {
            if (key === "App:Port")
                return 3000;
            return null;
        }
    });
});

const port = await app.configuration.getValueAsync("App:Port");
```

## API Reference
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/configuration#api-reference).

## Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.