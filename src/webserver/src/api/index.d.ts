/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Exception } from "@contextjs/system";

//#region Extensions

declare module "@contextjs/core"
{
    export interface Application {
        /**
         * Adds ContextJS webserver to the application.
         * @param options The webserver options.
         * @returns The current instance of the application.
         */
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;
    }
}

/** Represents the webserver options. */
export declare class WebServerOptions {

    /** The http options. */
    public http: { enabled: boolean; port?: number; };

    /** The https options. */
    public https: { enabled: boolean; port?: number; certificate?: SSLCertificate; };

    /**
     * Adds a middleware to the webserver.
     * 
     * @param middleware The middleware to add.
     * @returns The current instance of the WebServerOptions.
     */
    public useMiddleware(middleware: IMiddleware): WebServerOptions
}

//#endregion

//#region Interfaces

/** Represents the webserver HttpContext generic interface. */
export declare interface IHttpContext {
    /** The context http request. */
    request: IHttpRequest;

    /** The context http response. */
    response: IHttpResponse;
}

/** Interface for server request */
export interface IHttpRequest {
    /** Gets the http version. */
    readonly httpVersion: string;

    /** Gets the request headers. */
    readonly headers: HttpHeader[];

    /** Gets request method. */
    readonly httpMethod: string | null;

    /** Gets the Url. */
    readonly url: string | null;

    /** Gets the host. */
    readonly host: string | null;

    /** Gets the status code. */
    readonly statusCode: number | null;

    /** Gets the status message. */
    readonly statusMessage: string | null;
}

/**
 * Represents a server response.
 * @interface
 */
export declare interface IHttpResponse {
    /** Gets or sets the status code. */
    statusCode: number;

    /**
     * Writes text to the response body.
     * @param text The text to write.
     * @param encoding The encoding of the text. Optional.
     */
    write(text: string, encoding?: BufferEncoding): void;

    /**
     * Streams a file to the response.
     * @param filePath The file path.
     */
    streamAsync(filePath: string): Promise<void>;

    /** 
     * Sets a response header. 
     * 
     * @param name The name of the header.
     * @param value The value of the header.
    */
    setHeader(name: string, value: number | string | string[]): void;
}

/**
 * Represents the interface used by all server middleware.
 */
export interface IMiddleware {
    /** Gets or sets the middleware name. */
    name: string;

    /** Gets or sets the middleware version. */
    version: string;

    /** Event that will be executed on server request. */
    onRequestAsync(httpContext: IHttpContext, next: () => Promise<void>): Promise<void>;

    /** Event that will be execute on server error */
    onErrorAsync?(exception: any): Promise<void>;
}

//#endregion

//#region Classes

/** Represents the webserver class. */
export declare class WebServer {
    /** Initializes a new instance of the WebServer class. */
    constructor(options: WebServerOptions);

    /**
     * Event that will be emited on server error
     * @param exception 
     */
    public onErrorAsync?(exception: any): Promise<void>;

    /**
     * Adds middleware to the webserver.
     * 
     * @param middleware The middleware to add.
     * @returns The current instance of webserver.
     */
    public useMiddleware(middleware: IMiddleware): WebServer;

    /** Runs the server */
    public startAsync(): Promise<void>;

    /** Stops the server */
    public stopAsync(): Promise<void>;

    /** Restarts the server */
    public restartAsync(): Promise<void>;

    /** Returns true if the server is listening on http. */
    public listeningOnHttp(): boolean;

    /** Returns true if the server is listening on https. */
    public listeningOnHttps(): boolean;
}

/**
 * Represents a HTTP header.
 */
export declare class HttpHeader {
    /**
     * Initializes a new instance of HttpHeader.
     * @param name The name of the header.
     * @param value The value of the header.
     * 
     * @throws Exception When the "name" parameter is null or empty or whitespace.
     * @throws Exception When the "value" parameter is null or undefined.
     */
    public constructor(name: string, value: number | string | string[]);
}

/**
 * Provides a list of MIME types.
 */
export declare class MimeTypes {
    /**
     * Gets the MIME type for the specified extension.
     * @param extension The extension.
     * @returns The MIME type.
     */
    public static get(extension: string): string | null;
}

//#endregion

//#region Exceptions

/**
 * Represents an exception that is thrown when a certificate key is invalid.
 */
export declare class InvalidCertificateKeyException extends Exception {
    /**
     * Initializes a new instance of the InvalidCertificateKeyException class.
     * @param name The name of the certificate key.
     */
    public constructor(name: string);
}

/**
 * Represents an exception that is thrown when a certificate is invalid.
 */
export declare class InvalidCertificateException extends Exception {
    /**
     * Initializes a new instance of the InvalidCertificateException class.
     * @param name The name of the certificate.
     */
    public constructor(name: string);
}

/**
 * Represents an exception that is thrown when a middleware already exists.
 */
export declare class MiddlewareExistsException extends Exception {
    /**
     * Initializes a new instance of the MiddlewareExistsException class.
     * @param name The name of the middleware.
     */
    public constructor(name: string);
}

//#endregion

//#region Types

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

/** Represents an SSL certificate. */
export declare type SSLCertificate = {
    key: string;
    certificate: string;
}

//#endregion