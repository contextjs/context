/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Path } from "@contextjs/io";
import { Console } from "@contextjs/system";
import fs from "fs";
import os from "node:os";
import test, { TestContext } from "node:test";
import path from "path";
import { CommandDelegationService } from "../src/services/command-delegation.service.js";
import { ProviderDiscoveryService } from "../src/services/provider-discovery.service.js";

async function withTempDirAsync<T>(runInTempDir: (tempDirPath: string) => Promise<T> | T): Promise<T> {
    const systemTempDir = os.tmpdir();
    const tempDirPath = fs.mkdtempSync(path.join(systemTempDir, "ctxtest-"));
    let result: T | undefined;

    try {
        result = await runInTempDir(tempDirPath);
        return result;
    }
    finally {
        fs.rmSync(tempDirPath, { recursive: true, force: true });
    }
}

test("CommandDelegationService: exits if no command is given", async (context: TestContext) => {
    let exitWasCalled = false;
    let errorOutput = "";
    const originalExit = process.exit;
    const originalConsoleError = Console.writeLineError;
    process.exit = () => { exitWasCalled = true; throw new Error("exit"); };
    Console.writeLineError = (msg: string) => { errorOutput = msg; };

    context.after(() => {
        process.exit = originalExit;
        Console.writeLineError = originalConsoleError;
    });

    try {
        await CommandDelegationService.delegate({ parsedArguments: [], compilerExtensions: [] });
    }
    catch { }

    context.assert.strictEqual(exitWasCalled, true);
    context.assert.match(errorOutput, /No command specified/);
});

test("CommandDelegationService: exits if no providers have the command", async (context: TestContext) => {
    let exitWasCalled = false;
    let warningOutput = "";
    const originalExit = process.exit;
    const originalConsoleWarning = Console.writeLineWarning;
    process.exit = () => { exitWasCalled = true; throw new Error("exit"); };
    Console.writeLineWarning = (msg: string) => { warningOutput = msg; };
    const originalProviderDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [{ name: "foo", root: "/mockroot", templates: new Dictionary(), commands: new Dictionary(), compilerExtensions: [] }];

    context.after(() => {
        process.exit = originalExit;
        Console.writeLineWarning = originalConsoleWarning;
        ProviderDiscoveryService.discover = originalProviderDiscover;
    });

    try {
        await CommandDelegationService.delegate({ parsedArguments: [{ name: "bar", values: [], }], compilerExtensions: [] });
    }
    catch { }

    context.assert.strictEqual(exitWasCalled, true);
    context.assert.match(warningOutput, /No providers found for command 'bar'/);
});

test("CommandDelegationService: delegates to a template command handler (single match)", async (context: TestContext) => {
    await withTempDirAsync(async (tempDirPath) => {
        const originalProviderDiscover = ProviderDiscoveryService.discover;

        const handlerModulePath = path.join(tempDirPath, "handler.mjs");
        fs.writeFileSync(handlerModulePath, `export async function runAsync(ctx) { ctx.called = true; }`);

        ProviderDiscoveryService.discover = () => [
            {
                name: "p",
                root: tempDirPath,
                templates: new Map([
                    ["t", {
                        title: "T", path: "", description: "",
                        commands: new Map([
                            ["mycmd", { description: "d", help: "h", path: "handler.mjs" }]
                        ])
                    }]
                ]) as any,
                commands: new Map() as any,
                compilerExtensions: []
            }
        ];
        context.after(() => { ProviderDiscoveryService.discover = originalProviderDiscover; });

        const delegateContext: any = { parsedArguments: [{ name: "mycmd", values: [] }] };
        await CommandDelegationService.delegate(delegateContext);
        await new Promise(resolve => setImmediate(resolve));

        context.assert.strictEqual(delegateContext.called, true);
    });
});

test("CommandDelegationService: delegates to a provider/root command handler (single match)", async (context: TestContext) => {
    await withTempDirAsync(async (tempDirPath) => {
        const originalProviderDiscover = ProviderDiscoveryService.discover;

        const handlerModulePath = path.join(tempDirPath, "rootHandler.mjs");
        fs.writeFileSync(handlerModulePath, `export async function runAsync(ctx) { ctx.rootCalled = true; }`);

        ProviderDiscoveryService.discover = () => [
            {
                name: "p",
                root: tempDirPath,
                templates: new Map() as any,
                commands: new Map([
                    ["mycmd", { description: "d", help: "h", path: "rootHandler.mjs" }]
                ]) as any,
                compilerExtensions: []
            }
        ];
        context.after(() => { ProviderDiscoveryService.discover = originalProviderDiscover; });

        const delegateContext: any = { parsedArguments: [{ name: "mycmd", values: [] }] };
        await CommandDelegationService.delegate(delegateContext);

        context.assert.strictEqual(delegateContext.rootCalled, true);
    });
});

test("CommandDelegationService: ambiguity - exits if multiple matches and not resolved", async (context: TestContext) => {
    let exitWasCalled = false, warningOutput = "", messageOutput = "";
    const infoOutputLines: string[] = [];
    const originalExit = process.exit;
    process.exit = () => { exitWasCalled = true; throw new Error("exit"); };
    const originalConsoleWarning = Console.writeLineWarning;
    Console.writeLineWarning = (msg: string) => { warningOutput = msg; };
    const originalConsoleInfo = Console.writeLineInfo;
    Console.writeLineInfo = (msg: string) => { infoOutputLines.push(msg); };
    const originalConsoleLog = Console.writeLine;
    Console.writeLine = (msg: string) => { messageOutput = msg; };

    const originalProviderDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [
        {
            name: "p",
            root: "/r",
            templates: new Map([
                ["t1", {
                    title: "T", path: "", description: "",
                    commands: new Map([
                        ["c", { description: "d", help: "h", path: "h1.js" }]
                    ])
                }],
                ["t2", {
                    title: "T2", path: "", description: "",
                    commands: new Map([
                        ["c", { description: "d2", help: "h2", path: "h2.js" }]
                    ])
                }]
            ]) as any,
            commands: new Map([
                ["c", { description: "rd", help: "rh", path: "root.js" }]
            ]) as any,
            compilerExtensions: []
        }
    ];

    context.after(() => {
        process.exit = originalExit;
        Console.writeLineWarning = originalConsoleWarning;
        Console.writeLineInfo = originalConsoleInfo;
        Console.writeLine = originalConsoleLog;
        ProviderDiscoveryService.discover = originalProviderDiscover;
    });

    try {
        await CommandDelegationService.delegate({ parsedArguments: [{ name: "c", values: [] }], compilerExtensions: [] });
    }
    catch { }

    context.assert.strictEqual(exitWasCalled, true);
    context.assert.match(warningOutput, /Multiple handlers found/);
    context.assert.ok(infoOutputLines.some(line => line.includes("t1 [p] (handler: h1.js)")));
    context.assert.ok(infoOutputLines.some(line => line.includes("t2 [p] (handler: h2.js)")));
    context.assert.ok(infoOutputLines.some(line => line.includes("[provider: p] (handler: root.js)")));
    context.assert.strictEqual(messageOutput, "Please specify with --template or --provider.");
});

test("CommandDelegationService: resolves ambiguity with --template or --provider", async (context: TestContext) => {
    await withTempDirAsync(async (tempDirPath) => {
        const originalProviderDiscover = ProviderDiscoveryService.discover;

        const handlerModulePath = path.join(tempDirPath, "h2.mjs");
        fs.writeFileSync(handlerModulePath, `export async function runAsync(ctx) { ctx.disambiguated = true; }`);

        ProviderDiscoveryService.discover = () => [
            {
                name: "p",
                root: tempDirPath,
                templates: new Map([
                    ["t1", {
                        title: "T", path: "", description: "",
                        commands: new Map([
                            ["c", { description: "d", help: "h", path: "h1.js" }]
                        ])
                    }],
                    ["t2", {
                        title: "T2", path: "", description: "",
                        commands: new Map([
                            ["c", { description: "d2", help: "h2", path: "h2.mjs" }]
                        ])
                    }]
                ]) as any,
                commands: new Map([
                    ["c", { description: "rd", help: "rh", path: "root.js" }]
                ]) as any,
                compilerExtensions: []
            }
        ];
        context.after(() => { ProviderDiscoveryService.discover = originalProviderDiscover; });

        const delegateContext: any = {
            parsedArguments: [
                { name: "c", values: [] },
                { name: "--template", values: ["t2"] }
            ]
        };
        await CommandDelegationService.delegate(delegateContext);

        context.assert.strictEqual(delegateContext.disambiguated, true);
    });
});

test("CommandDelegationService: handler load error exits", async (context: TestContext) => {
    let exitWasCalled = false, errorOutput = "";
    const originalExit = process.exit;
    process.exit = () => { exitWasCalled = true; throw new Error("exit"); };
    const originalConsoleError = Console.writeLineError;
    Console.writeLineError = (msg: string) => { errorOutput = msg; };

    const originalProviderDiscover = ProviderDiscoveryService.discover;
    const originalPathResolve = Path.resolve;
    Path.resolve = (...args: string[]) => "/fail.js";
    context.after(() => { Path.resolve = originalPathResolve; });

    ProviderDiscoveryService.discover = () => [
        {
            name: "p",
            root: "/r",
            templates: new Map([
                ["t", {
                    title: "T", path: "", description: "",
                    commands: new Map([
                        ["failcmd", { description: "d", help: "h", path: "fail.js" }]
                    ])
                }]
            ]) as any,
            commands: new Map() as any,
            compilerExtensions: []
        }
    ];

    context.after(() => {
        ProviderDiscoveryService.discover = originalProviderDiscover;
        process.exit = originalExit;
        Console.writeLineError = originalConsoleError;
    });

    try {
        await CommandDelegationService.delegate({ parsedArguments: [{ name: "failcmd", values: [] }], compilerExtensions: [] });
    }
    catch { }

    context.assert.strictEqual(exitWasCalled, true);
    context.assert.match(errorOutput, /Could not load handler/);
});

test("CommandDelegationService: handler missing runAsync exits", async (context: TestContext) => {
    let exitWasCalled = false, errorOutput = "";
    const originalExit = process.exit;
    process.exit = () => { exitWasCalled = true; throw new Error("exit"); };

    const originalConsoleError = Console.writeLineError;
    Console.writeLineError = (msg: string) => { errorOutput = msg; };

    const originalProviderDiscover = ProviderDiscoveryService.discover;

    await withTempDirAsync(async (tempDirPath) => {
        const handlerModulePath = path.join(tempDirPath, "noasync.mjs");
        fs.writeFileSync(handlerModulePath, `// no runAsync here`);

        ProviderDiscoveryService.discover = () => [
            {
                name: "p",
                root: tempDirPath,
                templates: new Map([
                    ["t", {
                        title: "T", path: "", description: "",
                        commands: new Map([
                            ["noasync", { description: "d", help: "h", path: "noasync.mjs" }]
                        ])
                    }]
                ]) as any,
                commands: new Map() as any,
                compilerExtensions: []
            }
        ];

        context.after(() => {
            ProviderDiscoveryService.discover = originalProviderDiscover;
            process.exit = originalExit;
            Console.writeLineError = originalConsoleError;
        });

        try {
            await CommandDelegationService.delegate({ parsedArguments: [{ name: "noasync", values: [] }], compilerExtensions: [] });
        }
        catch { }

        context.assert.strictEqual(exitWasCalled, true);
        context.assert.match(errorOutput, /does not export a runAsync/);
    });
});