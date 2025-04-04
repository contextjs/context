/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console, Exception, Throw } from "@contextjs/system";
import { IncomingMessage, Server, ServerResponse } from "http";
import { InvalidCertificateKeyException } from "./exceptions/invalid-certificate-key.exception.js";
import { InvalidCertificateException } from "./exceptions/invalid-certificate.exception.js";
import { MiddlewareExistsException } from "./exceptions/middleware-exists.exception.js";
import { HttpContext } from "./http-context.js";
import { HttpRequest } from "./http-request.js";
import { HttpResponse } from "./http-response.js";
import { IMiddleware } from "./interfaces/i-middleware.js";
import { WebServerOptions } from "./extensions/webserver-options.js";

export class WebServer {

    private middleware: IMiddleware[] = [];
    private options: WebServerOptions;
    private httpServer: Server | null = null;
    private httpsServer: Server | null = null;

    public onErrorAsync?(exception: any): Promise<void>;

    constructor(options: WebServerOptions) {
        Throw.ifNullOrUndefined(options);
        this.options = options;
    }

    public useMiddleware(middleware: IMiddleware): WebServer {
        Throw.ifNullOrUndefined(middleware);
        if (this.middleware.find(item => item.name === middleware.name))
            throw new MiddlewareExistsException(middleware.name);

        this.middleware.push(middleware);

        return this;
    }

    public async startAsync(): Promise<void> {
        await this.createHttpServerAsync();
        await this.createHttpsServerAsync();
    }

    public async stopAsync(): Promise<void> {
        if (this.httpServer && this.httpServer.listening) {
            Console.writeLineInfo("Context Web Server is stopping [http]");
            this.httpServer.close();
        }
        else
            Console.writeLineInfo("Context Web Server is not listening on http.");

        if (this.httpsServer && this.httpsServer.listening) {
            Console.writeLineInfo("Context Web Server is stopping [https]");
            this.httpsServer.close();
        }
        else
            Console.writeLineInfo("Context Web Server is not listening on https.");
    }

    public async restartAsync(): Promise<void> {
        Console.writeLineInfo("Context Web Server is restarting.");

        await this.stopAsync();
        await this.startAsync();
    }

    public listeningOnHttp(): boolean {
        return this.httpServer?.listening || false;
    }

    public listeningOnHttps(): boolean {
        return this.httpsServer?.listening || false;
    }

    private async createHttpServerAsync(): Promise<void> {
        if (!this.options.http.enabled)
            return;

        var http = await import('http');
        this.httpServer = http.createServer();

        this.httpServer.on('request', async (request: IncomingMessage, response: ServerResponse) => await this.parseRequestAsync(request, response));
        this.httpServer.on('error', async (exception: Exception) => await this.parseExceptionAsync(this.httpsServer, exception));

        const port = this.options.http.port || 80;
        this.httpServer.listen(port);
        Console.writeLineInfo(`Context Web Server is starting on port ${port} [http]`);
    }

    private async createHttpsServerAsync(): Promise<void> {
        if (!this.options.https.enabled)
            return

        Throw.ifNullOrUndefined(this.options.https.certificate);

        const key = File.read(this.options.https.certificate!.key);
        if (!key)
            throw new InvalidCertificateKeyException(this.options.https.certificate!.key);

        const certificate = File.read(this.options.https.certificate!.certificate);
        if (!certificate)
            throw new InvalidCertificateException(this.options.https.certificate!.certificate);

        var https = await import('https');
        this.httpsServer = https.createServer({ key: key, cert: certificate });

        this.httpsServer.on('request', async (request: IncomingMessage, response: ServerResponse) => await this.parseRequestAsync(request, response));
        this.httpsServer.on('error', async (exception: Error) => await this.parseExceptionAsync(this.httpsServer, exception));

        const port = this.options.https.port || 443;
        this.httpsServer.listen(port);
        Console.writeLineInfo(`Context Web Server is starting on port ${port} [https]`);
    }

    private async parseRequestAsync(request: IncomingMessage, response: ServerResponse): Promise<void> {
        try {
            var httpContext = new HttpContext(new HttpRequest(request), new HttpResponse(response));
            httpContext.response.setHeader('Server', 'ContextJS');
            let executeNextMiddleware = false;

            for (let i = 0; i < this.middleware.length; i++) {
                if (i == 0 || executeNextMiddleware) {
                    executeNextMiddleware = false;
                    await this.middleware[i].onRequestAsync(httpContext, async () => { executeNextMiddleware = true; });
                }
                else
                    break;
            }

            httpContext.response.setHeader('Server', 'ContextJS');
            httpContext.response.end();
        }
        catch (exception: any) {
            await this.parseExceptionAsync(null, exception);
        }
    }

    private async parseExceptionAsync(server: Server | null, exception: Exception): Promise<void> {
        await this.onErrorAsync?.(exception);
    }
}