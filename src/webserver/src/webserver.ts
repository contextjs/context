import { File } from "@contextjs/io";
import { Console, Throw } from "@contextjs/system";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import { Socket } from "node:net";
import { InvalidCertificateKeyException } from "./exceptions/invalid-certificate-key.exception.js";
import { InvalidCertificateException } from "./exceptions/invalid-certificate.exception.js";
import { MiddlewareExistsException } from "./exceptions/middleware-exists.exception.js";
import { WebServerOptions } from "./extensions/webserver-options.js";
import { HttpContext } from "./http-context.js";
import { HttpRequest } from "./http-request.js";
import { HttpResponse } from "./http-response.js";
import { IMiddleware } from "./interfaces/i-middleware.js";

export class WebServer {
    private middleware: IMiddleware[] = [];
    private options: WebServerOptions;
    private httpServer: Server | null = null;
    private httpsServer: Server | null = null;
    private gracefulShutdownAttached = false;

    public onErrorAsync?(exception: unknown): Promise<void>;
    public onTimeoutAsync?(): Promise<void>;

    public constructor(options: WebServerOptions) {
        Throw.ifNullOrUndefined(options);

        this.options = options;
        this.options.webServer = this;
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

        this.attachGracefulShutdownIfNeeded();
    }

    public async stopAsync(): Promise<void> {
        if (this.httpServer?.listening) {
            Console.writeLineInfo("ContextJS Web Server is stopping [http]");
            this.httpServer.close();
        }

        if (this.httpsServer?.listening) {
            Console.writeLineInfo("ContextJS Web Server is stopping [https]");
            this.httpsServer.close();
        }
    }

    public async restartAsync(): Promise<void> {
        Console.writeLineInfo("ContextJS Web Server is restarting.");
        await this.stopAsync();
        await this.startAsync();
    }

    public async disposeAsync(): Promise<void> {
        await this.stopAsync();
        this.middleware = [];
        this.httpServer = null;
        this.httpsServer = null;
    }

    public listeningOnHttp(): boolean {
        return this.httpServer?.listening || false;
    }

    public listeningOnHttps(): boolean {
        return this.httpsServer?.listening || false;
    }

    public isRunning(): boolean {
        return this.listeningOnHttp() || this.listeningOnHttps();
    }

    private attachGracefulShutdownIfNeeded(): void {
        if (this.gracefulShutdownAttached)
            return;

        const shutdown = async () => {
            Console.writeLineInfo("Received termination signal. Shutting down ContextJS web server...");
            await this.disposeAsync();
            process.exit(0);
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

        this.gracefulShutdownAttached = true;
    }

    private async createHttpServerAsync(): Promise<void> {
        if (!this.options.http.enabled)
            return;

        this.httpServer = (await import("http")).createServer();
        this.httpServer.on("request", this.parseRequestAsync.bind(this));
        this.httpServer.on("error", this.parseExceptionAsync.bind(this));
        this.httpServer.on("timeout", this.handleTimeoutAsync.bind(this));
        this.httpServer.setTimeout(this.options.http.timeout);

        const port = this.options.http.port || 80;
        this.httpServer.listen(port);
        Console.writeLineInfo(`ContextJS Web Server is listening on port ${port} [http]`);
    }

    private async createHttpsServerAsync(): Promise<void> {
        if (!this.options.https.enabled)
            return;

        Throw.ifNullOrUndefined(this.options.https.certificate);

        const key = File.read(this.options.https.certificate!.key);
        if (!key)
            throw new InvalidCertificateKeyException(this.options.https.certificate!.key);

        const certificate = File.read(this.options.https.certificate!.certificate);
        if (!certificate)
            throw new InvalidCertificateException(this.options.https.certificate!.certificate);

        this.httpsServer = (await import("https")).createServer({ key: key, cert: certificate } as import("https").ServerOptions);
        this.httpsServer.on("request", this.parseRequestAsync.bind(this));
        this.httpsServer.on("error", this.parseExceptionAsync.bind(this));
        this.httpsServer.on("timeout", this.handleTimeoutAsync.bind(this));
        this.httpsServer.setTimeout(this.options.https.timeout);

        const port = this.options.https.port || 443;
        this.httpsServer.listen(port);
        Console.writeLineInfo(`ContextJS Web Server is listening on port ${port} [https]`);
    }

    private async parseRequestAsync(request: IncomingMessage, response: ServerResponse): Promise<void> {
        try {
            const httpContext = new HttpContext(new HttpRequest(request), new HttpResponse(response));

            let index = 0;
            const next = async (): Promise<void> => {
                if (index < this.middleware.length)
                    await this.middleware[index++].onRequestAsync(httpContext, next);
            };

            await next();

            this.finalizeResponse(httpContext);
        }
        catch (exception: unknown) {
            await this.parseExceptionAsync(exception);
        }
    }

    private finalizeResponse(httpContext: HttpContext): void {
        if ((httpContext.response as any).serverResponse.writableEnded)
            return;

        httpContext.response.setHeader("Server", "ContextJS");
        httpContext.response.end();
    }

    private async parseExceptionAsync(exception: unknown): Promise<void> {
        await this.onErrorAsync?.(exception);
    }

    private async handleTimeoutAsync(socket: Socket): Promise<void> {
        await this.onTimeoutAsync?.();
        Console.writeLineInfo("ContextJS Web Server timed out.");
        socket.destroy();
    }
}