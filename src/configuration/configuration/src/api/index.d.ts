/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from "@contextjs/system";

/**
 * Class representing options for configuring the application's settings.
 */
export declare class ConfigurationOptions {
    /**
     * The configuration object for the application.
     * @type {Configuration}
     */
    public readonly configuration: Configuration;

    /**
     * Adds a custom configuration provider to the configuration.
     * 
     * @param {IConfigurationProvider} provider - The configuration provider to add.
     * @returns {ConfigurationOptions} - The current instance of ConfigurationOptions.
     */
    public useProvider(provider: IConfigurationProvider): ConfigurationOptions;

    /**
     * Enables the use of environment variables in the configuration.
     * 
     * @returns {ConfigurationOptions} - The current instance of ConfigurationOptions.
     */
    public useEnvironmentVariables(): ConfigurationOptions;
}

/**
 * Class representing the configuration for the application.
 * It manages configuration providers and retrieves configuration values.
 */
export declare class Configuration {
    /**
     * The application associated with this configuration.
     * @type {Application}
     */
    public readonly application: Application;

    /**
     * An array of configuration providers used to retrieve configuration values.
     * @type {IConfigurationProvider[]}
     */
    public readonly providers: IConfigurationProvider[];

    /**
     * Indicates whether environment variables should be used in the configuration.
     * @type {boolean}
     */
    public useEnvironmentVariables: boolean;

    /**
     * Retrieves a configuration value based on the provided key.
     * 
     * @param {string} key - The key used to look up the configuration value.
     * @returns {Promise<any>} - A promise that resolves to the configuration value if found, otherwise null.
     */
    public getValueAsync(key: string): Promise<any>;
}

//#region Extensions

/**
 * Module declaration for "@contextjs/system".
 */
declare module "@contextjs/system" {
    /**
     * Interface for extending the Application.
     */
    export interface Application {
        /**
         * The configuration object for the application.
         * @type {Configuration}
         */
        configuration: Configuration;

        /**
         * Configures the application using the provided configuration options.
         * 
         * @param {(configurationOptions: ConfigurationOptions) => void} options - A callback function to configure the application.
         * @returns {Application} - The current application instance.
         * @throws {NullReferenceException} - If the options parameter is null or undefined.
         */
        useConfiguration(options: (configurationOptions: ConfigurationOptions) => void): Application;
    }
}

//#endregion

//#region Interfaces

/**
 * Interface representing a configuration provider.
 * A configuration provider retrieves configuration values based on keys.
 */
export declare interface IConfigurationProvider {
    /**
     * Retrieves a configuration value based on the provided key.
     * 
     * @param {string} key - The key used to look up the configuration value.
     * @returns {Promise<any>} - A promise that resolves to the configuration value if found, otherwise null.
     */
    getValueAsync(key: string): Promise<any>;
}

//#endregion