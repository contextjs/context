/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, SystemException } from "@contextjs/system";

/**
 * Augment the base Application to integrate ContextJS WebServer.
 */
declare module "@contextjs/system" {
    export interface Application {
        /**
         * Configure and attach a WebServer to the application.
         * @param options Callback to configure WebServerOptions.
         * @returns The Application instance for chaining.
         */
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;

        /**
         * The active WebServer instance attached to the application.
         */
        webServer: WebServer;
    }
}

/**
 * HTTP verb types for routing and middleware.
 */
export declare type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Core HTTP/HTTPS server for handling requests and middleware pipeline.
 */
export declare class WebServer {

    /**
     * The application instance associated with the WebServer.
     */
    public application: Application;

    /**
     * Create a new WebServer with the given configuration options.
     */
    public constructor();

    /**
     * Create a new WebServer with the given configuration options.
     * @param options The WebServerOptions to apply settings and certificates.
     */
    public constructor(options: WebServerOptions);

    /**
     * Set or update the WebServer configuration options.
     * @param options The WebServerOptions to apply settings and certificates.
     * @returns The WebServer instance for chaining.
     */
    public setOptions(options: WebServerOptions): this;

    /**
     * Register a middleware component to be invoked on each request.
     * @param middleware The middleware implementation.
     * @returns The WebServer instance for chaining.
     */
    public useMiddleware(middleware: IMiddleware): this;

    /**
     * Start listening for connections based on configured HTTP/HTTPS options.
     */
    public startAsync(): Promise<void>;

    /**
     * Stop the server, waiting for active connections to close.
     */
    public stopAsync(): Promise<void>;

    /**
     * Restart the server by stopping and then starting again.
     */
    public restartAsync(): Promise<void>;
}

/**
 * Configuration root for WebServer, including general, HTTP, HTTPS, and event callbacks.
 */
export declare class WebServerOptions {
    /**
     * Reference to the associated WebServer instance.
     */
    public webServer: WebServer;
    /**
     * General settings affecting header sizes, pooling, and timeouts.
     */
    public general: GeneralWebServerOptions;
    /**
     * HTTP-specific network settings.
     */
    public http: HttpWebServerOptions;
    /**
     * HTTPS-specific network settings and SSL certificate.
     */
    public https: HttpsWebServerOptions;
    /**
     * Callback invoked for informational, warning, and error events.
     */
    public onEvent: (event: WebServerEvent) => void;

    /**
     * Initialize WebServerOptions with optional sub-settings and event handler.
     * @param general GeneralWebServerOptions overrides.
     * @param http HttpWebServerOptions overrides.
     * @param https HttpsWebServerOptions overrides.
     * @param onEvent Event callback for server lifecycle events.
     */
    public constructor(
        general?: GeneralWebServerOptions,
        http?: HttpWebServerOptions,
        https?: HttpsWebServerOptions,
        onEvent?: (event: WebServerEvent) => void);

    /**
     * Register a middleware component to be invoked on each request.
     * @param middleware The middleware implementation.
     * @returns The WebServerOptions instance for chaining.
     **/
    public useMiddleware(middleware: IMiddleware): this;
}

/**
 * General configuration options for max header size, context pool, and idle socket cleanup.
 */
export declare class GeneralWebServerOptions {
    /**
     * Maximum size (bytes) allowed for incoming request headers.
     */
    public maximumHeaderSize: number;
    /**
     * Number of pre-allocated HttpContext objects in the pool.
     */
    public httpContextPoolSize: number;
    /**
     * Time (ms) after which idle sockets are closed.
     */
    public idleSocketsTimeout: number;

    /**
     * Create general server settings.
     * @param maximumHeaderSize Maximum header byte length.
     * @param httpContextPoolSize Number of contexts to pool.
     * @param idleSocketsTimeout Idle socket timeout in milliseconds.
     */
    public constructor(maximumHeaderSize?: number, httpContextPoolSize?: number, idleSocketsTimeout?: number);
}

/**
 * Base class for HTTP and HTTPS endpoint settings.
 */
export declare class WebServerOptionsBase {
    /**
     * Whether this protocol (HTTP/HTTPS) is enabled.
     */
    public enabled: boolean;
    /**
     * Port number to bind the server socket.
     */
    public port: number;
    /**
     * Optional hostname or IP address to bind.
     */
    public host?: string;
    /**
     * Keep-alive timeout (ms) for persistent connections.
     */
    public keepAliveTimeout: number;
}

/**
 * HTTP-specific network settings.
 */
export declare class HttpWebServerOptions extends WebServerOptionsBase {
    /**
     * Construct HTTP settings with defaults or overrides.
     * @param enabled Toggle HTTP support (default: true).
     * @param host Bind address (default: "0.0.0.0").
     * @param port Port number (default: 80).
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(enabled?: boolean, host?: string, port?: number, keepAliveTimeout?: number);
}

/**
 * HTTPS-specific network settings, including SSL certificate.
 */
export declare class HttpsWebServerOptions extends WebServerOptionsBase {
    /**
     * SSL certificate key and chain for encrypted connections.
     */
    public certificate: SSLCertificate;

    /**
     * Construct HTTPS settings with optional SSL certificate and overrides.
     * @param enabled Toggle HTTPS support (default: false).
     * @param host Bind address (default: "0.0.0.0").
     * @param port Port number (default: 443).
     * @param certificate SSL key and cert strings.
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(
        enabled?: boolean,
        host?: string,
        port?: number,
        certificate?: SSLCertificate,
        keepAliveTimeout?: number);
}

/**
 * SSL certificate definition for TLS handshake.
 */
export declare type SSLCertificate = {
    /**
     * PEM-encoded private key.
     */
    key: string;
    /**
     * PEM-encoded certificate chain.
     */
    cert: string;
};

/**
 * Middleware implementation to handle request lifecycle events.
 */
export declare interface IMiddleware {
    /**
     * Unique name of the middleware.
     */
    name: string;
    /**
     * Optional semantic version for ordering or compatibility.
     */
    version?: string;

    /**
     * Handler invoked for each incoming HTTP context.
     * @param httpContext The active request/response context.
     * @param next Optional continuation callback to invoke next middleware.
     */
    onRequest(httpContext: HttpContext, next?: () => Promise<void> | void): Promise<void> | void;
}

//#region Models

/**
 * Events emitted by the WebServer during operation.
 */
export type WebServerEvent =
    | { type: "info"; detail: unknown }
    | { type: "warning"; detail: unknown }
    | { type: "error"; detail: unknown };

/**
 * Collection of HTTP headers with case-insensitive lookups.
 */
export declare class HeaderCollection {
    /**
     * Get the header value for the given name.
     * @param name Header name (case-insensitive).
     * @returns The header value or undefined if not present.
     */
    public get(name: string): string | undefined;

    /**
     * Set a header value, overwriting existing values.
     * @param name Header name.
     * @param value Header value string.
     */
    public set(name: string, value: string): void;

    /**
     * Determine if a header exists.
     * @param name Header name.
     */
    public has(name: string): boolean;

    /**
     * Iterate over normalized header entries as [name, value].
     */
    public entries(): IterableIterator<[string, string]>;

    /**
     * Iterate over original header entries preserving casing.
     */
    public originalEntries(): IterableIterator<[string, string]>;

    /**
     * Iterate over values with both original name and value.
     */
    public values(): IterableIterator<{ originalName: string; value: string }>;

    /**
     * Remove all headers from the collection.
     */
    public clear(): void;
}

/**
 * Request summary exposing method, path, and headers.
 */
export declare class Request {
    /**
     * HTTP method (GET, POST, etc.).
     */
    public readonly method: string;

    /**
     * URL path of the request.
     */
    public readonly path: string;

    /**
     * Parsed request headers.
     */
    public readonly headers: HeaderCollection;
}

/**
 * Response builder for status, headers, and payload.
 */
export declare class Response {
    /**
     * Set status code and optional reason phrase.
     * @param code Numeric HTTP status code.
     * @param message Optional reason phrase (default from code).
     * @returns The Response instance for chaining.
     */
    public setStatus(code: number, message?: string): this;

    /**
     * Add or override a header on the response.
     * @param nameHeader name of the response header.
     * @param value Header value(s), joined if array.
     * @returns The Response instance for chaining.
     */
    public setHeader(name: string, value: string | number | string[]): this;

    /**
     * Send a complete body as Buffer or string and close connection.
     * @param body Payload to send.
     */
    public sendAsync(body: Buffer | string): Promise<void>;

    /**
     * Stream a readable stream directly to the client.
     * @param stream Node.js Readable stream.
     */
    public streamAsync(stream: NodeJS.ReadableStream): Promise<void>;

    /**
     * Add a callback to be invoked when the response ends.
     * @returns The Response instance for chaining.
     */
    public onEnd(callback: () => void | Promise<void>): this;

    /**
     * End the response, invoking all onEnd callbacks.
     * @returns A promise that resolves when the response is fully sent.
     */
    public endAsync(): Promise<void>;
}

/**
 * Combined HTTP context providing request and response objects.
 */
export declare class HttpContext {

    /**
     * Parsed incoming request information.
     */
    public readonly request: Request;

    /**
     * Response builder for sending data.
     */
    public readonly response: Response;
}

export declare class MimeTypes {

    /**
     * Lookup a MIME type based on file extension.
     * @param extension File extension to look up.
     * @param defaultType Optional default MIME type if not found.
     * @returns The corresponding MIME type or null if not found.
     */
    public static get(extension: string): string | null;

    /**
     * Lookup a MIME type based on file extension with a default fallback.
     * @param extension File extension to look up.
     * @param defaultType Default MIME type if not found.
     * @returns The corresponding MIME type or the default if not found.
     */
    public static get(extension: string, defaultType: string | null): string | null;
}

//#endregion

//#region Exceptions

/**
 * Base exception type for WebServer errors.
 */
export declare class WebServerException extends SystemException {
    /**
     * Create a WebServerException for general errors.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown after a response has already been sent.
 */
export declare class ResponseSentException extends WebServerException {
    /**
     * Create a ResponseSentException when attempting additional operations after send.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when the HTTP context pool is exhausted or invalid.
 */
export declare class HttpContextPoolException extends WebServerException {
    /**
     * Create an exception for context pooling failures.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Generic middleware error during request processing.
 */
export declare class MiddlewareException extends WebServerException {
    /**
     * Create a MiddlewareException for errors in middleware logic.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when attempting to register middleware with a duplicate name.
 */
export declare class MiddlewareExistsException extends WebServerException {
    /**
     * Create an exception indicating the middleware name conflict.
     * @param name Name of the middleware that already exists.
     * @param options Standard ErrorOptions.
     */
    public constructor(name: string, options?: ErrorOptions);
}

/**
 * Thrown when an SSL certificate key is missing or invalid.
 */
export declare class InvalidCertificateKeyException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL key.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}

/**
 * Thrown when an SSL certificate chain is missing or invalid.
 */
export declare class InvalidCertificateException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL certificate.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}

//#endregion