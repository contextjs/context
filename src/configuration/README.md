# @contextjs/configuration

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/configuration?cache=300)](https://www.npmjs.com/package/@contextjs/configuration)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Lightweight configuration system for ContextJS applications, featuring async providers and environment variable support.

## ✨ Features

- Fluent API for configuring providers
- Async-based configuration loading
- Support for environment variables
- Pluggable provider model
- Seamless integration with `Application` via `.useConfiguration()`

## 📦 Installation

```bash
npm i @contextjs/configuration
```

## 🚀 Quick Start

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

## 📘 API Reference

### `ConfigurationOptions`

```ts
class ConfigurationOptions {
    public readonly configuration: Configuration;

    public useProvider(provider: IConfigurationProvider): ConfigurationOptions;
    public useEnvironmentVariables(): ConfigurationOptions;
}
```

### `Configuration`

```ts
class Configuration {
    public readonly application: Application;
    public readonly providers: IConfigurationProvider[];
    public useEnvironmentVariables: boolean;

    public getValueAsync(key: string): Promise<any>;
}
```

### `IConfigurationProvider`

```ts
interface IConfigurationProvider {
    getValueAsync(key: string): Promise<any>;
}
```

## 🧩 Application Extension

The `Application` class from `@contextjs/system` is automatically extended with configuration support:

```ts
declare module "@contextjs/system" {
    export interface Application {
        configuration: Configuration;
        useConfiguration(options: (configurationOptions: ConfigurationOptions) => void): Application;
    }
}
```

## 🧪 Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.