import { HttpContext, WebServer, WebServerOptions } from "@contextjs/webserver";
import autocannon from 'autocannon';
import express from "express";
import fastify from "fastify";
import fs from "node:fs/promises";
import http from "node:http";
import { join } from "path";

class Server {
    public name: string;
    public host: string;
    public port: number;
    public close: any;

    public constructor(
        name: string,
        host: string,
        port: number) {
        this.name = name;
        this.host = host;
        this.port = port;
    }
}

class Benchmark {
    private ENABLE_WARMUP = true;
    private ITERATIONS = 3;
    private CONCURRENCY = 500;
    private PIPELINING_FACTOR = 1;
    private DURATION_SECONDS = 10;
    private servers: Server[] = [];

    public constructor() {
        this.initializeServers();
    }

    private async initializeServers() {
        console.log("Starting servers...");

        const contextJS = new Server("ContextJS", "127.0.0.1", 3000);
        await this.startWebServer(contextJS);
        this.servers.push(contextJS);

        const raw = new Server("Node.js Raw HTTP", "127.0.0.1", 3001)
        await this.startRawHttpServer(raw);
        this.servers.push(raw);

        const fastify = new Server("Fastify", "127.0.0.1", 3002);
        await this.startFastifyServer(fastify);
        this.servers.push(fastify);

        const express = new Server("Express", "127.0.0.1", 3003);
        await this.startExpressServer(express);
        this.servers.push(express);
    }

    private async stopAsync() {
        console.log("\nStopping servers...");
        for (const server of this.servers) {
            console.log(`Stopping ${server.name}...`);
            await server?.close();
        }

        console.log("All servers stopped.");
        process.exit(0);
    }

    public async executeAsync() {
        process.on("SIGINT", this.stopAsync.bind(this));
        process.on("SIGTERM", this.stopAsync.bind(this));

        await this.sleep(1000);

        if (this.ENABLE_WARMUP) {
            console.log("\n=== Warmup ===");
            for (const server of this.servers)
                await this.runBenchmark(server.name, `http://${server.host}:${server.port}`, 1, this.CONCURRENCY);
        }

        console.log(`\n=== Concurrency: ${this.CONCURRENCY} clients ===`);

        let results: any = [];
        for (const server of this.servers)
            results.push(await this.runBenchmark(server.name, `http://${server.host}:${server.port}`, this.ITERATIONS, this.CONCURRENCY));

        let summaryTable = "| Server | Req/sec | Latency (ms) | Throughput (MB/s) | Errors |\n|--------|--------:|-------------:|------------------:|-------:|\n";
        for (const result of results)
            summaryTable += `| ${result.name} | ${result.requests} | ${result.latency} | ${result.throughput} | ${result.errors} |\n`;

        let extendedTable = "| Server | Connections | Pipelining | Duration (s) | Latency Stdev (ms) | Requests Stdev | Throughput Stdev (MB/s) | Total Requests |\n|--------|------------:|-----------:|-------------:|-------------------:|---------------:|------------------------:|----:|\n";
        for (const result of results)
            extendedTable += `| ${result.name} | ${result.connections} | ${result.pipelining} | ${result.duration} | ${result.latencyStdDev} | ${result.requestsStdDev} | ${result.throughputStdDev} | ${result.totalRequests} |\n`;

        await this.updateReadmeSectionAsync("src/webserver/webserver/README.md", summaryTable, extendedTable);
        await this.updateReadmeSectionAsync("README.md", summaryTable, extendedTable);
        await this.stopAsync();
    }

    private async updateReadmeSectionAsync(file: string, summaryTable: string, extendedTable: string) {
        const readmePath = join(process.cwd(), file);
        let content = await fs.readFile(readmePath, "utf8");

        const updated = content
            .replace(
                /<!-- BENCHMARKS_SUMMARY:START -->[\s\S]*?<!-- BENCHMARKS_SUMMARY:END -->/,
                `<!-- BENCHMARKS_SUMMARY:START -->\n${summaryTable}\n<!-- BENCHMARKS_SUMMARY:END -->`
            )
            .replace(
                /<!-- BENCHMARKS_EXTENDED:START -->[\s\S]*?<!-- BENCHMARKS_EXTENDED:END -->/,
                `<!-- BENCHMARKS_EXTENDED:START -->\n${extendedTable}\n<!-- BENCHMARKS_EXTENDED:END -->`
            );

        await fs.writeFile(readmePath, updated, "utf8");
    }

    private async startWebServer(server: Server): Promise<void> {
        const webServerOptions = new WebServerOptions();
        webServerOptions.http.host = server.host;
        webServerOptions.http.port = server.port;
        const webServer = new WebServer(webServerOptions);
        webServer.useMiddleware({
            name: "benchmark",
            version: "1.0.0",
            onRequest: async (context: HttpContext) => {
                await context.response
                    .setHeader("Content-Type", "text/plain; charset=utf-8")
                    .setHeader("X-Custom", "benchmark")
                    .setHeader("Keep-Alive", "timeout=72")
                    .sendAsync("OK");
            }
        });
        webServer.startAsync();
        await webServer.waitUntilListening();
        console.log(`ContextJS WebServer running on http://${server.host}:${server.port}`);

        server.close = async () => webServer.stopAsync();
    }

    private async startRawHttpServer(server: Server): Promise<void> {
        const webServer = http.createServer((req, res) => {
            const body = "OK";
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Custom": "benchmark",
                "Connection": "keep-alive",
                "Keep-Alive": "timeout=72",
                "Content-Length": Buffer.byteLength(body),
            });
            res.end(body);
        });
        await new Promise<void>(resolve => webServer.listen(server.port, server.host, resolve));
        console.log(`Node.js Raw HTTP Server running on http://${server.host}:${server.port}`);

        server.close = () => new Promise(resolve => webServer.close(resolve));
    }

    private async startFastifyServer(server: Server): Promise<void> {
        const app = fastify();
        app.get("/", (request, reply) => {
            reply
                .header("Content-Type", "text/plain; charset=utf-8")
                .header("X-Custom", "benchmark")
                .send("OK");
        });
        await app.listen({ port: server.port, host: server.host });
        console.log(`Fastify server running on http://${server.host}:${server.port}`);

        server.close = () => app.close();
    }

    private async startExpressServer(server: Server): Promise<void> {
        const app = express();
        app.get("/", (req, res) => {
            const body = "OK";
            res
                .setHeader("Content-Type", "text/plain; charset=utf-8")
                .setHeader("X-Custom", "benchmark")
                .setHeader("Connection", "keep-alive")
                .setHeader("Keep-Alive", "timeout=72")
                .setHeader("Content-Length", Buffer.byteLength(body));
            res.send(body);
        });

        const webServer = app.listen(server.port, server.host);
        console.log(`Express server running on http://${server.host}:${server.port}`);

        server.close = () => new Promise<void>((resolve: any) => webServer.close(resolve));
    }

    private async runBenchmark(
        name: string,
        url: string,
        samples: number,
        concurrency: number): Promise<{
            name: string;
            requests: string;
            latency: string;
            throughput: string;
            errors: string;
            connections: number;
            pipelining: number;
            duration: string;
            latencyStdDev: string;
            requestsStdDev: string;
            throughputStdDev: string;
            totalRequests: number;
        }> {
        const all = {
            requests: [] as number[],
            latency: [] as number[],
            throughput: [] as number[],
            errors: [] as number[],
        };

        const requests: number[] = [];

        let last: any;

        for (let i = 0; i < samples; i++) {
            console.log(`Running autocannon for ${name} on ${url} (sample ${i + 1}/${samples}, concurrency=${concurrency})...`);
            last = await this.runAutocannon(url);
            all.requests.push(last.requests.average);
            all.latency.push(last.latency.average);
            all.throughput.push(this.bytesToMB(last.throughput.average));
            all.errors.push(last.errors);

            requests.push(last.statusCodeStats["200"]?.count ?? 0);
        }

        const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0);

        return {
            name: name,
            requests: this.average(all.requests).toFixed(2),
            latency: this.average(all.latency).toFixed(2),
            throughput: this.average(all.throughput).toFixed(2),
            errors: this.average(all.errors).toFixed(2),
            connections: last.connections,
            pipelining: last.pipelining,
            duration: last.duration.toFixed(2),
            latencyStdDev: last.latency.stddev.toFixed(2),
            requestsStdDev: last.requests.stddev.toFixed(2),
            throughputStdDev: this.bytesToMB(last.throughput.stddev).toFixed(2),
            totalRequests: sum(requests),
        };
    }

    private async runAutocannon(url: string): Promise<any> {
        return autocannon({
            url,
            connections: this.CONCURRENCY,
            duration: this.DURATION_SECONDS,
            pipelining: this.PIPELINING_FACTOR
        });
    }

    private average(arr: number[]): number {
        return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
    }

    private bytesToMB(bytes: number): number {
        return parseFloat((bytes / 1024 / 1024).toFixed(2));
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const runner = new Benchmark();
await runner.executeAsync();