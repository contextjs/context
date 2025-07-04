/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { Directory, File, Path } from "@contextjs/io";
import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import path from "path";
import { BuildCommand, runAsync } from "../../src/commands/build.command.js";
import { Project } from "../../src/models/project.js";

const backupConsoleOutput = Console["output"];
const backupProcessExit = process.exit;
const backupWriteLineError = Console.writeLineError;
const backupWriteLine = Console.writeLine;
const backupWriteLineSuccess = Console.writeLineSuccess;
const backupDirectoryListFiles = Directory.listFiles;
const backupFileExists = File.exists;
const backupFileRead = File.read;
const backupFileGetExtension = File.getExtension;
const backupFileGetDirectory = File.getDirectory;
const backupFileCopy = File.copy;
const backupPathIsFile = Path.isFile;
const backupCompilerCompile = Compiler.compile;

function restoreGlobals() {
    Console.setOutput(backupConsoleOutput);
    process.exit = backupProcessExit;
    Console.writeLineError = backupWriteLineError;
    Console.writeLine = backupWriteLine;
    Console.writeLineSuccess = backupWriteLineSuccess;
    Directory.listFiles = backupDirectoryListFiles;
    File.exists = backupFileExists;
    File.read = backupFileRead;
    File.getExtension = backupFileGetExtension;
    File.getDirectory = backupFileGetDirectory;
    File.copy = backupFileCopy;
    Path.isFile = backupPathIsFile;
    Compiler.compile = backupCompilerCompile;
}

test("BuildCommand: runAsync - exits if no projects are found", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;
    class NoProjectsBuildCommand extends BuildCommand { getProjects() { return []; } }
    const command = new NoProjectsBuildCommand();
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => command.runAsync(testContext as any), /ProcessExit/);
    context.assert.match(capturedError, /No projects found/);

    restoreGlobals();
});

test("BuildCommand: runAsync - invokes buildAsync for single project", async (context: TestContext) => {
    let called = 0;
    Console.setOutput(() => { });
    Console.writeLineError = () => { };
    Console.writeLine = () => { };
    Console.writeLineSuccess = () => { };

    const project = new Project("myproj", "/tmp/test");
    Directory.listFiles = () => ["/tmp/test/myproj.ctxp"];
    File.getExtension = (f: string) => f.endsWith(".ctxp") ? "ctxp" : "";
    File.getDirectory = (f: string) => path.dirname(f);
    Path.isFile = () => true;

    const buildCommand = new BuildCommand();
    (buildCommand as any).getProjects = () => [project];
    (buildCommand as any).buildAsync = async () => { called++; };

    const ctx = { parsedArguments: [], compilerExtensions: [] };
    await buildCommand.runAsync(ctx);

    context.assert.strictEqual(called, 1, "buildAsync should be called once");

    restoreGlobals();
});

test("BuildCommand: buildAsync - exits if project file missing", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    File.exists = (filePath: string) => filePath.endsWith("tsconfig.json");
    File.read = () => "";
    File.copy = () => true;

    const buildCommand = new BuildCommand();
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => (buildCommand as any).buildAsync(project, testContext, {}), /ProcessExit/);
    context.assert.match(capturedError, /No project file found/);

    restoreGlobals();
});

test("BuildCommand: buildAsync - exits if tsconfig.json is missing", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    File.exists = (filePath: string) => filePath.endsWith("foo.ctxp");
    File.read = () => "{}";
    File.copy = () => true;

    const buildCommand = new BuildCommand();
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => (buildCommand as any).buildAsync(project, testContext, {}), /ProcessExit/);
    context.assert.match(capturedError, /No tsconfig.json/);

    restoreGlobals();
});

test("BuildCommand: buildAsync - logs and exits if exception is thrown", async (context: TestContext) => {
    let capturedError = "";
    let errorLogged = false;
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { errorLogged = true; capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    File.exists = () => { throw new Error("fail"); };

    const buildCommand = new BuildCommand();
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => (buildCommand as any).buildAsync(project, testContext, {}), /ProcessExit/);
    context.assert.ok(errorLogged);
    context.assert.match(capturedError, /Error building project/);

    restoreGlobals();
});

test("BuildCommand: copyFiles - performs file copies", (context: TestContext) => {
    let fileCopyLog: any[] = [];
    File.exists = () => true;
    File.copy = (source: string, destination: string, overwrite?: boolean) => {
        fileCopyLog.push({ source, destination, overwrite });
        return true;
    };
    const project = new Project("foo", "/projects/foo");
    const projectConfig = { files: [{ from: "input.txt", to: "out.txt" }] };
    const buildCommand = new BuildCommand();
    (buildCommand as any).copyFiles(project, projectConfig);

    context.assert.ok(fileCopyLog.some(entry => entry.source.endsWith("input.txt") && entry.destination.endsWith("out.txt")));

    restoreGlobals();
});

test("BuildCommand: copyFiles - logs error and exits if file not found", (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;
    File.exists = () => false;
    File.copy = () => true;
    const project = new Project("foo", "/projects/foo");
    const projectConfig = { files: [{ from: "input.txt", to: "out.txt" }] };

    const buildCommand = new BuildCommand();

    context.assert.throws(() => (buildCommand as any).copyFiles(project, projectConfig), /ProcessExit/);
    context.assert.match(capturedError, /not found/);

    restoreGlobals();
});

test("BuildCommand: copyFiles - logs error and exits if copy fails", (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;
    File.exists = () => true;
    File.copy = () => { throw new Error("fail"); };
    const project = new Project("foo", "/projects/foo");
    const projectConfig = { files: [{ from: "input.txt", to: "out.txt" }] };

    const buildCommand = new BuildCommand();

    context.assert.throws(() => (buildCommand as any).copyFiles(project, projectConfig), /ProcessExit/);
    context.assert.match(capturedError, /Error copying file/);

    restoreGlobals();
});

test("BuildCommand: compileAsync - exits if tsconfig parse fails", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("foo", "/projects/foo");
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => (new BuildCommand() as any).compileAsync(project, testContext, {}), /ProcessExit/);
    context.assert.match(capturedError, /Failed to parse tsconfig/);

    restoreGlobals();
});

test("BuildCommand: compileAsync - handles bad JSON parse in tsconfig", async (context: TestContext) => {
    let capturedError = "";
    Console.setOutput((...args: any[]) => { capturedError += args.join(" "); });
    Console.writeLineError = (...args: any[]) => { capturedError += args.join(" "); };
    process.exit = ((code: number) => { throw new Error("ProcessExit"); }) as any;

    File.read = () => "not json";
    File.exists = () => true;

    const project = new Project("foo", "/projects/foo");
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => (new BuildCommand() as any).compileAsync(project, testContext, {}), /ProcessExit/);
    context.assert.match(capturedError, /Failed to parse tsconfig/);
    
    restoreGlobals();
});

test("runAsync: delegates to BuildCommand.runAsync", async (context: TestContext) => {
    let methodCalled = false;
    const backupRunAsync = BuildCommand.prototype.runAsync;
    BuildCommand.prototype.runAsync = async function (ctx) { methodCalled = true; return "ok" as any; };

    const testContext = { parsedArguments: [], compilerExtensions: [] };
    const result = await runAsync(testContext as any);

    context.assert.strictEqual(methodCalled, true);
    context.assert.strictEqual(result, "ok");

    BuildCommand.prototype.runAsync = backupRunAsync;
});