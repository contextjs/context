/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { BuildCommand } from "../../src/commands/build.command.js";
import { RunCommand, runAsync } from "../../src/commands/run.command.js";
import { Project } from "../../src/models/project.js";

const backupConsoleOutput = Console["output"];
const backupWriteLine = Console.writeLine;
const backupWriteLineError = Console.writeLineError;
const backupFileExists = File.exists;
const backupFileRead = File.read;
const backupProcessExit = process.exit;
const backupArgv = process.argv.slice();
const backupEnv = { ...process.env };

function resetTestEnvironment() {
    Console.setOutput(backupConsoleOutput);
    Console.writeLine = backupWriteLine;
    Console.writeLineError = backupWriteLineError;
    File.exists = backupFileExists;
    File.read = backupFileRead;
    process.exit = backupProcessExit;
    process.argv = backupArgv.slice();
    Object.assign(process.env, backupEnv);
}

test("RunCommand: runAsync - invokes BuildCommand if --no-build is missing", async (context: TestContext) => {
    let buildWasCalled = false;
    const savedBuildRunAsync = BuildCommand.prototype.runAsync;
    BuildCommand.prototype.runAsync = async function () { buildWasCalled = true; };

    class RunCommandWithProjects extends RunCommand {
        getProjects() { return [new Project("proj", "/some/path")]; }
    }

    const command = new RunCommandWithProjects();
    (command as any).runProjectAsync = async () => { };
    await command.runAsync({ parsedArguments: [], compilerExtensions: [] });

    context.assert.strictEqual(buildWasCalled, true);

    BuildCommand.prototype.runAsync = savedBuildRunAsync;
    resetTestEnvironment();
});

test("RunCommand: runAsync - does not invoke build if --no-build is present", async (context: TestContext) => {
    let buildWasCalled = false;
    const savedBuildRunAsync = BuildCommand.prototype.runAsync;
    BuildCommand.prototype.runAsync = async function () { buildWasCalled = true; };

    const command = new RunCommand();
    (command as any).getProjects = () => [new Project("proj", "/some/path")];
    (command as any).runProjectAsync = async () => { };
    await command.runAsync({ parsedArguments: [{ name: "--no-build", values: [] }], compilerExtensions: [] });

    context.assert.strictEqual(buildWasCalled, false);

    BuildCommand.prototype.runAsync = savedBuildRunAsync;
    resetTestEnvironment();
});

test("RunCommand: runAsync - exits if no projects found", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args) => { capturedError += args.join(" "); });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const command = new RunCommand();
    (command as any).getProjects = () => [];

    await context.assert.rejects(() => command.runAsync({ parsedArguments: [], compilerExtensions: [] }), /ProcessExit/);
    context.assert.match(capturedError, /No projects found/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - exits if .ctxp file is missing", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = () => false;
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /\.ctxp file found/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - exits if no 'main' entry in .ctxp", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = () => true;
    File.read = () => JSON.stringify({});
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /No 'main' entry/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - exits if tsconfig.json is missing", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = (filePath: string) => filePath.endsWith(".ctxp");
    File.read = () => JSON.stringify({ main: "index.ts" });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /No tsconfig\.json found/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - exits if tsconfig outDir is missing", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = (filePath: string) => filePath.endsWith(".ctxp") || filePath.endsWith("tsconfig.json");
    File.read = (filePath: string) =>
        filePath.endsWith("tsconfig.json")
            ? JSON.stringify({ compilerOptions: {} })
            : JSON.stringify({ main: "index.ts" });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /missing 'compilerOptions.outDir'/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - exits if compiled main does not exist", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = (filePath: string) =>
        filePath.endsWith(".ctxp") || filePath.endsWith("tsconfig.json")
            ? true
            : false;
    File.read = (filePath: string) =>
        filePath.endsWith("tsconfig.json")
            ? JSON.stringify({ compilerOptions: { outDir: "dist" } })
            : JSON.stringify({ main: "index.ts" });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /Compiled entry file/);

    resetTestEnvironment();
});

test("RunCommand: runProjectAsync - logs error and exits on exception", async (context: TestContext) => {
    let capturedError = "";
    Console.writeLineError = (...args) => { capturedError += args.join(" "); };
    File.exists = () => true;
    File.read = () => { throw new Error("fail"); };
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;
    const project = new Project("demo", "/demo");
    const command = new RunCommand();

    await context.assert.rejects(() => (command as any).runProjectAsync(project), /ProcessExit/);
    context.assert.match(capturedError, /Error running project/);

    resetTestEnvironment();
});

test("runAsync: delegates to RunCommand", async (context: TestContext) => {
    let wasInvoked = false;
    const savedRunAsync = RunCommand.prototype.runAsync;
    RunCommand.prototype.runAsync = async function (ctx) { wasInvoked = true; return "ok" as any; };
    const testContext = { parsedArguments: [], compilerExtensions: [] };
    const result = await runAsync(testContext as any);

    context.assert.strictEqual(wasInvoked, true);
    context.assert.strictEqual(result, "ok");
    
    RunCommand.prototype.runAsync = savedRunAsync;
});