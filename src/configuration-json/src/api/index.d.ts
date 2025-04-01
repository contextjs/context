/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

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