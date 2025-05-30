/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import fs from "node:fs";
import os, { tmpdir } from "node:os";
import path from "node:path";
import test, { TestContext } from "node:test";
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { BuildCommand } from "../../../src/services/commands/build.command.ts";
import { RunCommand } from "../../../src/services/commands/run.command.ts";

const mockProcessExit = (context: TestContext) => {
    const originalExit = process.exit;
    let exitCode = -1;
    process.exit = (code: number) => {
        exitCode = code ?? -1;
        throw new Error(`exit:${code}`);
    };
    context.after(() => { process.exit = originalExit; });
    return () => exitCode;
};

const mockConsoleOutput = (context: TestContext) => {
    const originalOutput = Console["output"];
    let output = "";
    Console.setOutput((...args: any[]) => { output += args.map(String).join(" ") + "\n"; });
    context.after(() => { Console.setOutput(originalOutput); });
    return () => output;
};

test("RunCommand: exits if no projects found", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const command = new Command(CommandType.Run, []);
    const runCommand = new RunCommand();
    context.mock.method(runCommand as any, "getProjects", () => []);

    let threw: Error | null = null;
    try {
        await runCommand.runAsync(command);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /No projects found\. Exiting/);
});

test("RunCommand: exits if no context.ctxp file", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("missing-ctxp", path.join(os.tmpdir(), "run-missing-ctxp"));
    const runCommand = new RunCommand();
    context.mock.method(File, "exists", () => false);

    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /No context\.ctxp file found\. Exiting/);
});

test("RunCommand: exits if no main entry in ctxp", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("no-main", path.join(os.tmpdir(), "run-no-main"));
    context.mock.method(File, "exists", () => true);
    context.mock.method(File, "read", () => JSON.stringify({}));

    const runCommand = new RunCommand();
    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /No 'main' entry found in context\.ctxp project file\./);
});

test("RunCommand: exits if no tsconfig.json file", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("missing-tsconfig", path.join(os.tmpdir(), "run-missing-tsconfig"));
    context.mock.method(File, "exists", (file) => file.endsWith("context.ctxp"));
    context.mock.method(File, "read", () => JSON.stringify({ main: "main.js" }));

    const runCommand = new RunCommand();
    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /No tsconfig\.json found\./);
});

test("RunCommand: exits if tsconfig.json is invalid", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("bad-tsconfig", path.join(os.tmpdir(), "run-bad-tsconfig"));
    context.mock.method(File, "exists", () => true);
    context.mock.method(File, "read", (file) => {
        if (file.endsWith("context.ctxp")) return JSON.stringify({ main: "main.js" });
        throw new Error("Invalid tsconfig");
    });

    const runCommand = new RunCommand();
    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /Failed to parse tsconfig\.json\./);
});

test("RunCommand: exits if tsconfig.json has missing outDir", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("no-outdir", path.join(os.tmpdir(), "run-no-outdir"));
    context.mock.method(File, "exists", () => true);
    context.mock.method(File, "read", (file) => {
        if (file.endsWith("context.ctxp")) return JSON.stringify({ main: "main.js" });
        if (file.endsWith("tsconfig.json")) return JSON.stringify({ compilerOptions: {} });
        throw new Error("Unexpected");
    });

    const runCommand = new RunCommand();
    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /tsconfig\.json is missing 'compilerOptions\.outDir'\./);
});

test("RunCommand: exits if compiled entry file not found", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);

    const project = new Project("not-found-entry", path.join(os.tmpdir(), "run-not-found-entry"));
    context.mock.method(File, "exists", (file) => {
        if (file.endsWith("context.ctxp"))
            return true;
        if (file.endsWith("tsconfig.json"))
            return true;
        return false;
    });
    context.mock.method(File, "read", (file) => {
        if (file.endsWith("context.ctxp"))
            return JSON.stringify({ main: "main.js" });
        if (file.endsWith("tsconfig.json"))
            return JSON.stringify({ compilerOptions: { outDir: "dist" } });
        throw new Error("Unexpected");
    });

    const runCommand = new RunCommand();
    let threw: Error | null = null;
    try {
        await (runCommand as any).runProjectAsync(project);
    }
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /Compiled entry file/);
});

test("RunCommand: runs project and imports entry", async (context: TestContext) => {
    const tempDir = fs.mkdtempSync(path.join(tmpdir(), "ctx-run-"));
    const mainPath = path.join(tempDir, "dist", "main.js");
    fs.mkdirSync(path.dirname(mainPath), { recursive: true });
    fs.writeFileSync(mainPath, `globalThis.__ctx_entry_executed = true; export const test = 42;`);
    File.save(path.join(tempDir, "context.ctxp"), JSON.stringify({ main: "main.js" }), true);
    File.save(path.join(tempDir, "tsconfig.json"), JSON.stringify({ compilerOptions: { outDir: "dist" } }), true);

    const project = new Project("ok", tempDir);
    const runCommand = new RunCommand();

    context.mock.method(Console, "writeLine", () => { });

    await (runCommand as any).runProjectAsync(project);

    context.assert.strictEqual(globalThis.__ctx_entry_executed, true);

    fs.rmSync(tempDir, { recursive: true, force: true });
    delete globalThis.__ctx_entry_executed;
});

test("RunCommand: skips build if --no-build specified", async (context: TestContext) => {
    const tempDir = fs.mkdtempSync(path.join(tmpdir(), "ctx-run-nobuild-"));
    const mainPath = path.join(tempDir, "dist", "main.js");
    fs.mkdirSync(path.dirname(mainPath), { recursive: true });
    fs.writeFileSync(mainPath, "export const test = 42;");

    File.save(path.join(tempDir, "context.ctxp"), JSON.stringify({ main: "main.js" }), true);
    File.save(path.join(tempDir, "tsconfig.json"), JSON.stringify({ compilerOptions: { outDir: "dist" } }), true);

    const runCommand = new RunCommand();
    const command = new Command(CommandType.Run, [{ name: "--no-build", values: [] }]);
    context.mock.method(runCommand as any, "getProjects", () => [new Project("skip-build", tempDir)]);
    let buildCalled = false;
    context.mock.method(BuildCommand.prototype, "runAsync", () => { buildCalled = true; });
    context.mock.method(Console, "writeLine", () => { });

    await runCommand.runAsync(command);

    context.assert.strictEqual(buildCalled, false);

    fs.rmSync(tempDir, { recursive: true, force: true });
});