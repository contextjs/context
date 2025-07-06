/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { WatchCommand, runAsync } from "../../src/commands/watch.command.js";
import { Project } from "../../src/models/project.js";

const originalConsoleOutput = Console["output"];
const originalWriteLine = Console.writeLine;
const originalWriteLineError = Console.writeLineError;
const originalFileExists = File.exists;
const originalFileRead = File.read;
const originalCompilerWatch = Compiler.watch;
const originalProcessExit = process.exit;

function restoreGlobals() {
    Console.setOutput(originalConsoleOutput);
    Console.writeLine = originalWriteLine;
    Console.writeLineError = originalWriteLineError;
    File.exists = originalFileExists;
    File.read = originalFileRead;
    Compiler.watch = originalCompilerWatch;
    process.exit = originalProcessExit;
}

test("WatchCommand: runAsync exits when no projects are found", async (context: TestContext) => {
    let errorMessages = "";
    Console.setOutput((...args) => { errorMessages += args.join(" "); });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    class NoProjectsWatchCommand extends WatchCommand { getProjects() { return []; } }
    const watchCommand = new NoProjectsWatchCommand();
    const contextObj = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => watchCommand.runAsync(contextObj as any), /ProcessExit/);
    context.assert.match(errorMessages, /No projects found/);

    restoreGlobals();
});

test("WatchCommand: watchAsync exits when .ctxp file is missing", async (context: TestContext) => {
    let errorMessage = "";
    Console.writeLineError = (...args) => { errorMessage += args.join(" "); };
    File.exists = (filePath: string) => !filePath.endsWith(".ctxp");
    File.read = () => "{}";
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    const watchCommand = new WatchCommand();

    await context.assert.rejects(() => (watchCommand as any).watchAsync(project, { parsedArguments: [], compilerExtensions: [] }, {}), /ProcessExit/);
    context.assert.strictEqual(errorMessage, "No context.ctxp project file found. Exiting...");

    restoreGlobals();
});

test("WatchCommand: watchAsync exits when tsconfig.json is missing", async (context: TestContext) => {
    let errorMessages = "";
    Console.writeLineError = (...args) => { errorMessages += args.join(" "); };
    File.exists = (filePath: string) => filePath.endsWith(".ctxp");
    File.read = () => "{}";
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    const watchCommand = new WatchCommand();
    await context.assert.rejects(() => (watchCommand as any).watchAsync(project, { parsedArguments: [], compilerExtensions: [] }, {}), /ProcessExit/);

    context.assert.match(errorMessages, /No tsconfig\.json file found/);

    restoreGlobals();
});

test("runAsync delegates to WatchCommand", async (context: TestContext) => {
    let invoked = false;
    const originalRunAsync = WatchCommand.prototype.runAsync;
    WatchCommand.prototype.runAsync = async function (ctx) { invoked = true; return "ok" as any; };
    const mockContext = { parsedArguments: [], compilerExtensions: [] };
    const result = await runAsync(mockContext as any);

    context.assert.strictEqual(invoked, true);
    context.assert.strictEqual(result, "ok");

    WatchCommand.prototype.runAsync = originalRunAsync;
});

test("WatchCommand: watchAsync exits if tsconfig parse fails", async (context: TestContext) => {
    let errorMessages = "";
    Console.writeLineError = (...args) => { errorMessages += args.join(" "); };
    File.exists = (filePath: string) => filePath.endsWith(".ctxp") || filePath.endsWith("tsconfig.json");
    File.read = () => "{}";
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/nonexistent/path/for-test");
    const watchCommand = new WatchCommand();

    await context.assert.rejects(() => (watchCommand as any).watchAsync(project, { parsedArguments: [], compilerExtensions: [] }, {}), /ProcessExit/);
    context.assert.match(errorMessages, /Failed to parse tsconfig\.json for watch/);

    restoreGlobals();
});