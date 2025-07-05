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
import { RestoreCommand, runAsync } from "../../src/commands/restore.command.js";
import { Project } from "../../src/models/project.js";

const backupConsoleOutput = Console["output"];
const backupWriteLine = Console.writeLine;
const backupWriteLineError = Console.writeLineError;
const backupWriteLineSuccess = Console.writeLineSuccess;
const backupFileExists = File.exists;
const backupProcessExit = process.exit;

function resetGlobals() {
    Console.setOutput(backupConsoleOutput);
    Console.writeLine = backupWriteLine;
    Console.writeLineError = backupWriteLineError;
    Console.writeLineSuccess = backupWriteLineSuccess;
    File.exists = backupFileExists;
    process.exit = backupProcessExit;
}

test("RestoreCommand: runAsync - exits if no projects found", async (context: TestContext) => {
    let errorLog = "";
    Console.setOutput((...args) => { errorLog += args.join(" "); });
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    class RestoreCommandNoProjects extends RestoreCommand { getProjects() { return []; } }
    const restoreCommand = new RestoreCommandNoProjects();
    const testContext = { parsedArguments: [], compilerExtensions: [] };

    await context.assert.rejects(() => restoreCommand.runAsync(testContext as any), /ProcessExit/);
    context.assert.match(errorLog, /No projects found/);

    resetGlobals();
});

test("RestoreCommand: restoreAsync - exits if .ctxp file missing", async (context: TestContext) => {
    let errorLog = "";
    Console.setOutput((...args) => { errorLog += args.join(" "); });
    Console.writeLineError = (...args) => { errorLog += args.join(" "); };
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("demo", "/projects/demo");
    File.exists = (filePath: string) => filePath.endsWith("tsconfig.json");
    const restoreCommand = new RestoreCommand();

    await context.assert.rejects(() => (restoreCommand as any).restoreAsync(project), /ProcessExit/);
    context.assert.match(errorLog, /\.ctxp file found/);

    resetGlobals();
});

test("RestoreCommand: restoreAsync - exits if tsconfig.json missing", async (context: TestContext) => {
    let errorLog = "";
    Console.setOutput((...args) => { errorLog += args.join(" "); });
    Console.writeLineError = (...args) => { errorLog += args.join(" "); };
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("demo", "/projects/demo");
    File.exists = (filePath: string) => filePath.endsWith(".ctxp");
    const restoreCommand = new RestoreCommand();

    await context.assert.rejects(() => (restoreCommand as any).restoreAsync(project), /ProcessExit/);
    context.assert.match(errorLog, /tsconfig\.json file found/);

    resetGlobals();
});

test("RestoreCommand: restoreAsync - logs error and exits on execSync failure", async (context: TestContext) => {
    let errorLog = "";
    Console.setOutput((...args) => { errorLog += args.join(" "); });
    Console.writeLineError = (...args) => { errorLog += args.join(" "); };
    Console.writeLine = () => { };
    Console.writeLineSuccess = () => { };
    process.exit = (() => { throw new Error("ProcessExit"); }) as any;

    const project = new Project("demo", "/projects/demo");
    File.exists = () => true;

    const backupExecSync = globalThis.execSync;
    globalThis.execSync = () => { throw new Error("fail"); };
    const restoreCommand = new RestoreCommand();

    await context.assert.rejects(() => (restoreCommand as any).restoreAsync(project), /ProcessExit/);
    context.assert.match(errorLog, /Error restoring project/);

    if (backupExecSync !== undefined)
        globalThis.execSync = backupExecSync;
    else delete globalThis.execSync;

    resetGlobals();
});

test("RestoreCommand: restoreAsync - logs success on successful restore", async (context: TestContext) => {
    let successLog = "";
    Console.writeLineSuccess = (msg) => { successLog += msg; };
    Console.writeLine = () => { };
    Console.writeLineError = () => { };
    File.exists = () => true;

    const restoreCommand = new RestoreCommand();
    (restoreCommand as any).restoreAsync = async (proj: any) => {
        Console.writeLine(`Restoring project: "${proj.name}"...`);
        Console.writeLineSuccess(`Project "${proj.name}" restored successfully.`);
    };

    const project = new Project("demo", "/projects/demo");
    await (restoreCommand as any).restoreAsync(project);

    context.assert.match(successLog, /restored successfully/);

    resetGlobals();
});

test("runAsync: calls RestoreCommand.runAsync", async (context: TestContext) => {
    let wasCalled = false;
    const originalRunAsync = RestoreCommand.prototype.runAsync;
    RestoreCommand.prototype.runAsync = async function (ctx) { wasCalled = true; return "ok" as any; };

    const testContext = { parsedArguments: [], compilerExtensions: [] };
    const result = await runAsync(testContext as any);

    context.assert.strictEqual(wasCalled, true);
    context.assert.strictEqual(result, "ok");

    RestoreCommand.prototype.runAsync = originalRunAsync;
});