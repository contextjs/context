/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

/**
 * Extends ConfigurationOptions with support for JSON-based configuration.
 */
declare module "@contextjs/configuration" {
    export interface ConfigurationOptions {
        /**
         * Adds a JSON configuration provider to the application.
         *
         * @param options A callback to configure JSON file sources.
         * @returns The current ConfigurationOptions instance.
         */
        useJsonConfiguration(options: (configurationOptions: JsonConfigurationOptions) => void): ConfigurationOptions;
    }
}

/**
 * Provides options for configuring JSON-based configuration sources.
 */
export declare class JsonConfigurationOptions {
    /**
     * Registers a JSON file as a configuration source.
     *
     * @param file The path to the configuration file.
     * @returns The current JsonConfigurationOptions instance.
     */
    public useFile(file: string): JsonConfigurationOptions;

    /**
     * Registers a JSON file for a specific environment.
     *
     * @param file The path to the configuration file.
     * @param environmentName The target environment name (e.g., "development").
     * @returns The current JsonConfigurationOptions instance.
     */
    public useFile(file: string, environmentName: string): JsonConfigurationOptions;
}