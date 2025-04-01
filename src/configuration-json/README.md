# @contextjs/configuration

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/configuration-json)](https://www.npmjs.com/package/@contextjs/configuration-json)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

JSON configuration management

### Installation
```
npm i @contextjs/configuration-json
```

### Extensions

```typescript
/**
 * Module declaration for "@contextjs/configuration".
 */
declare module "@contextjs/configuration" {
    /**
     * Interface representing configuration options.
     */
    export interface ConfigurationOptions {
        /**
         * Adds a JSON configuration provider to the application configuration.
         * 
         * @param {(configurationOptions: JsonConfigurationOptions) => void} options - A callback function to configure JSON-specific options.
         * @returns {ConfigurationOptions} - The current configuration options instance.
         */
        useJsonConfiguration(options: (configurationOptions: JsonConfigurationOptions) => void): ConfigurationOptions;
    }
}
```

### Options

```typescript
/**
 * Class representing options for JSON configuration.
 */
export declare class JsonConfigurationOptions {

    /**
     * Use a file for configuration.
     * 
     * @param {string} file - The file to use for configuration.
     * @returns {JsonConfigurationOptions} - The instance of JsonConfigurationOptions.
     */
    public useFile(file: string): JsonConfigurationOptions;

    /**
     * Use a file for configuration with a specific environment name.
     * 
     * @param {string} file - The file to use for configuration.
     * @param {string} environmentName - The environment name.
     * @returns {JsonConfigurationOptions} - The instance of JsonConfigurationOptions.
     */
    public useFile(file: string, environmentName: string): JsonConfigurationOptions;
}
```