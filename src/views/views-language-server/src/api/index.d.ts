/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export declare class Server {
    /**
     * Starts the LSP Server.
     * @param options - Options for starting the server.
     */
    public static start(options: ServerOptions): void;
}

export declare class ServerOptions {
    /**
     * Indicates whether to use stdio for communication.
     */
    public stdio: boolean;
    /**
     * The programming language for the server.
     */
    public language: string;
    /**
     * Creates a new instance of ServerOptions.
     * @param stdio - Whether to use stdio for communication.
     * @param language - The programming language for the server.
     */
    constructor(stdio: boolean, language: string);
}