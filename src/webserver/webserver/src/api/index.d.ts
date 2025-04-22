/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

//#region Extensions

declare module "@contextjs/system" {
    export interface Application {
        /**
         * Adds the ContextJS web server to the application.
         * @param configure The configuration delegate used to set server options.
         * @returns The current Application instance.
         */
        useWebServer(configure: (webserverOptions: WebServerOptions) => void): Application;
    }
}

//#endregion

//#region Options

/** Represents configuration options for the web server. */
export declare class WebServerOptions {
    /** HTTP configuration. */
    public http: {
        enabled: boolean;
        port?: number;
        timeout?: number; // In milliseconds, default: 120_000 (2 min)
    };

    /** HTTPS configuration. */
    public https: {
        enabled: boolean;
        port?: number;
        timeout?: number; // In milliseconds, default: 120_000 (2 min)
        certificate?: SSLCertificate;
    };

    /**
     * Adds a middleware component to the web server pipeline.
     * @param middleware The middleware to add.
     * @returns The current WebServerOptions instance.
     */
    public useMiddleware(middleware: IMiddleware): WebServerOptions;
}

//#endregion

//#region Interfaces

/** Represents the context object for a web server request. */
export declare interface IHttpContext {
    /** The incoming HTTP request. */
    request: IHttpRequest;

    /** The outgoing HTTP response. */
    response: IHttpResponse;
}

/** Represents an HTTP request. */
export declare interface IHttpRequest {
    /** The HTTP version of the request. */
    readonly httpVersion: string;

    /** The request headers. */
    readonly headers: HttpHeader[];

    /** The HTTP method (e.g., GET, POST). */
    readonly httpMethod: string | null;

    /** The full request URL. */
    readonly url: string | null;

    /** The value of the `Host` header. */
    readonly host: string | null;

    /** The response status code, if known. */
    readonly statusCode: number | null;

    /** The response status message, if known. */
    readonly statusMessage: string | null;
}

/** Represents an HTTP response. */
export declare interface IHttpResponse {
    /** Gets or sets the HTTP status code. */
    statusCode: number;

    /**
     * Writes a string to the response body.
     * @param text The text to write.
     * @param encoding Optional encoding (default: "utf-8").
     */
    write(text: string, encoding?: BufferEncoding): void;

    /**
     * Streams a file from disk to the response.
     * @param filePath The path to the file to stream.
     */
    streamAsync(filePath: string): Promise<void>;

    /**
     * Sets a header on the response.
     * @param name The name of the header.
     * @param value The value of the header.
     */
    setHeader(name: string, value: number | string | string[]): void;
}

/** Represents a middleware component in the web server pipeline. */
export declare interface IMiddleware {
    /** The name of the middleware component. */
    name: string;

    /** The version of the middleware component. */
    version: string;

    /**
     * Invoked for each incoming request.
     * @param httpContext The HTTP context for the current request.
     * @param next A function to call the next middleware in the pipeline.
     */
    onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void>;

    /**
     * Invoked when an error occurs in the request pipeline.
     * @param exception The error that occurred.
     */
    onErrorAsync?(exception: any): Promise<void>;
}

//#endregion

//#region Core Classes

/** Represents the ContextJS web server. */
export declare class WebServer {
    /**
     * Initializes a new instance of the WebServer class.
     * @param options The web server configuration.
     */
    constructor(options: WebServerOptions);

    /**
     * Optional event triggered when an unhandled exception occurs.
     * @param exception The error that occurred.
     */
    public onErrorAsync?(exception: unknown): Promise<void>;

    /**
     * Optional event triggered when a request socket times out.
     */
    public onTimeoutAsync?(): Promise<void>;

    /**
     * Adds a middleware to the web server.
     * @param middleware The middleware to add.
     * @returns The current WebServer instance.
     */
    public useMiddleware(middleware: IMiddleware): WebServer;

    /** Starts the server. */
    public startAsync(): Promise<void>;

    /** Stops the server. */
    public stopAsync(): Promise<void>;

    /** Restarts the server. */
    public restartAsync(): Promise<void>;

    /** Disposes and shuts down the server completely. */
    public disposeAsync(): Promise<void>;

    /** Returns true if the HTTP server is currently listening. */
    public listeningOnHttp(): boolean;

    /** Returns true if the HTTPS server is currently listening. */
    public listeningOnHttps(): boolean;

    /** Returns true if either HTTP or HTTPS server is running. */
    public isRunning(): boolean;
}

/** Represents a single HTTP header. */
export declare class HttpHeader {
    /**
     * Initializes a new instance of the HttpHeader class.
     * @param name The name of the header.
     * @param value The value of the header.
     * @throws Exception if name is null, empty, or value is undefined.
     */
    constructor(name: string, value: number | string | string[]);
}

/** Provides MIME type resolution based on file extensions. */
export declare class MimeTypes {
    /**
     * Gets the MIME type associated with the given file extension.
     * @param extension The file extension (without the dot).
     * @returns The MIME type or null if unknown.
     */
    public static get(extension: string): string | null;
}

//#endregion

//#region Exceptions

/** Thrown when an SSL certificate key is invalid or unreadable. */
export declare class InvalidCertificateKeyException extends Exception {
    constructor(name: string);
}

/** Thrown when an SSL certificate file is invalid or unreadable. */
export declare class InvalidCertificateException extends Exception {
    constructor(name: string);
}

/** Thrown when a middleware component with the same name already exists. */
export declare class MiddlewareExistsException extends Exception {
    constructor(name: string);
}

//#endregion

//#region Types

/** Represents the text encoding used when writing to a response. */
export declare type BufferEncoding =
    | "ascii"
    | "utf8"
    | "utf-8"
    | "utf16le"
    | "utf-16le"
    | "ucs2"
    | "ucs-2"
    | "base64"
    | "base64url"
    | "latin1"
    | "hex";

/** Represents an SSL certificate pair used for HTTPS. */
export declare type SSLCertificate = {
    /** Path to the certificate key file. */
    key: string;

    /** Path to the public certificate file. */
    certificate: string;
};

//#endregion