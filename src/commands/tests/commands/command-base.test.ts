/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */
import { Directory, File, Path } from "@contextjs/io";
import { Console, ObjectExtensions, StringExtensions } from "@contextjs/system";
import test, { TestContext } from "node:test";
import typescript from "typescript";
import { CommandBase } from "../../src/commands/command-base.js";
import { Project } from "../../src/models/project.js";

const originalListFiles = Directory.listFiles;
const originalIsFile = Path.isFile;
const originalGetExtension = File.getExtension;
const originalRead = File.read;
const originalGetDirectory = File.getDirectory;
const originalWriteLineError = Console.writeLineError;
const originalWriteLineWarning = Console.writeLineWarning;
const originalWriteLine = Console.writeLine;
const originalIsNullOrUndefined = ObjectExtensions.isNullOrUndefined;
const originalIsNullOrWhitespace = StringExtensions.isNullOrWhitespace;

function restoreAll() {
    Directory.listFiles = originalListFiles;
    Path.isFile = originalIsFile;
    File.getExtension = originalGetExtension;
    File.read = originalRead;
    File.getDirectory = originalGetDirectory;
    Console.writeLineError = originalWriteLineError;
    Console.writeLineWarning = originalWriteLineWarning;
    Console.writeLine = originalWriteLine;
    ObjectExtensions.isNullOrUndefined = originalIsNullOrUndefined;
    StringExtensions.isNullOrWhitespace = originalIsNullOrWhitespace;
}

class TestCommandBase extends CommandBase {
    async runAsync() { }
}

test("CommandBase: getProjects returns all valid projects with no filter", (context: TestContext) => {
    Directory.listFiles = () => ["/repo/foo.ctxp", "/repo/bar.ctxp", "/repo/baz.ctxp"];
    Path.isFile = () => true;
    File.getExtension = (f) => f.endsWith(".ctxp") ? "ctxp" : "";
    File.read = (f) => {
        if (f.endsWith("foo.ctxp")) return JSON.stringify({ name: "foo" });
        if (f.endsWith("bar.ctxp")) return JSON.stringify({ name: "bar" });
        if (f.endsWith("baz.ctxp")) return JSON.stringify({ name: "baz" });
        return "";
    };
    File.getDirectory = (f) => "/repo";
    ObjectExtensions.isNullOrUndefined = (v): v is null | undefined => false;
    StringExtensions.isNullOrWhitespace = (v): v is null | undefined => false;

    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [] };
    const projects = cmd["getProjects"](ctx as any);

    context.assert.strictEqual(projects.length, 3);
    context.assert.ok(projects.some(p => p.name === "foo"));
    context.assert.ok(projects.some(p => p.name === "bar"));
    context.assert.ok(projects.some(p => p.name === "baz"));

    restoreAll();
});

test("CommandBase: getProjects filters by --project argument", (context: TestContext) => {
    Directory.listFiles = () => ["/repo/abc.ctxp", "/repo/xyz.ctxp"];
    Path.isFile = () => true;
    File.getExtension = () => "ctxp";
    File.read = (f) => {
        if (f.endsWith("abc.ctxp")) return JSON.stringify({ name: "abc" });
        if (f.endsWith("xyz.ctxp")) return JSON.stringify({ name: "xyz" });
        return "";
    };
    File.getDirectory = () => "/repo";
    ObjectExtensions.isNullOrUndefined = (v): v is null | undefined => false;
    StringExtensions.isNullOrWhitespace = (v): v is null | undefined => false;

    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [{ name: "--project", values: ["xyz"] }] };
    const projects = cmd["getProjects"](ctx as any);

    context.assert.strictEqual(projects.length, 1);
    context.assert.strictEqual(projects[0].name, "xyz");

    restoreAll();
});

test("CommandBase: getProjects logs and skips invalid project", (context: TestContext) => {
    let loggedError = "";
    Console.writeLineError = (...args: any[]) => { loggedError += args.join(" "); };
    Directory.listFiles = () => ["/repo/invalid.ctxp"];
    Path.isFile = () => true;
    File.getExtension = () => "ctxp";
    File.read = () => "{}";
    ObjectExtensions.isNullOrUndefined = (v): v is null | undefined => false;
    StringExtensions.isNullOrWhitespace = (v): v is null | undefined => true;

    File.getDirectory = () => "/repo";

    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [] };

    const projects = cmd["getProjects"](ctx as any);

    context.assert.strictEqual(projects.length, 0);
    context.assert.strictEqual(loggedError, "Project file /repo/invalid.ctxp does not contain a valid project name.");

    restoreAll();
});

test("CommandBase: getProjects logs and skips project with missing name", (context: TestContext) => {
    let loggedError = "";
    Console.writeLineError = (...args: any[]) => { loggedError += args.join(" "); };
    Directory.listFiles = () => ["/repo/bad.ctxp"];
    Path.isFile = () => true;
    File.getExtension = () => "ctxp";
    File.read = () => JSON.stringify({});
    ObjectExtensions.isNullOrUndefined = (value): value is null | undefined => false;
    StringExtensions.isNullOrWhitespace = (v): v is "" | null | undefined => v === null || v === undefined || v.trim() === "";
    File.getDirectory = () => "/repo";

    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [] };
    const projects = cmd["getProjects"](ctx as any);

    context.assert.strictEqual(projects.length, 0);
    context.assert.match(loggedError, /does not contain a valid project name/);

    restoreAll();
});

test("CommandBase: appendCLICompilerExtensions adds extensions from args", (context: TestContext) => {
    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [{ name: "--extensions", values: ["foo", "bar"] }], compilerExtensions: [] };
    ObjectExtensions.isNullOrUndefined = (value): value is null | undefined => false;
    cmd["appendCLICompilerExtensions"](ctx as any);

    context.assert.deepStrictEqual(ctx.compilerExtensions, ["foo", "bar"]);

    restoreAll();
});

test("CommandBase: appendCLICompilerExtensions skips if extensions arg missing", (context: TestContext) => {
    const cmd = new TestCommandBase();
    const ctx = { parsedArguments: [], compilerExtensions: [] };
    ObjectExtensions.isNullOrUndefined = (value): value is null | undefined => true;
    cmd["appendCLICompilerExtensions"](ctx as any);

    context.assert.deepStrictEqual(ctx.compilerExtensions, []);

    restoreAll();
});

test("CommandBase: getTransformersAsync - warns on failed import", async (context: TestContext) => {
    let warningOutput = "";
    const ctx = { compilerExtensions: ["/fail/ext.js"], parsedArguments: [] };
    const fakeProgram = {};
    globalThis["import"] = (_: string) => { throw new Error("fail!"); };
    Console.writeLineWarning = (...args: any[]) => { warningOutput += args.join(" "); };
    const cmd = new TestCommandBase();
    const result = await cmd["getTransformersAsync"](ctx as any, fakeProgram as any);
    
    context.assert.match(warningOutput, /Failed to load compiler extension/);
    context.assert.deepStrictEqual(result, { before: [], after: [] });

    restoreAll();
});

test("CommandBase: processDiagnostics logs error, warning, message types", (context: TestContext) => {
    let errorOut = "", warnOut = "", msgOut = "";
    Console.writeLineError = (msg) => { errorOut += msg; };
    Console.writeLineWarning = (msg) => { warnOut += msg; };
    Console.writeLine = (msg) => { msgOut += msg; };

    const cmd = new TestCommandBase();
    const project = new Project("proj", "/dir");
    const diagnostics = [
        { messageText: "err", category: typescript.DiagnosticCategory.Error },
        { messageText: "warn", category: typescript.DiagnosticCategory.Warning },
        { messageText: "msg", category: typescript.DiagnosticCategory.Message }
    ];

    cmd["processDiagnostics"](project, diagnostics as any);

    context.assert.match(errorOut, /err/);
    context.assert.match(warnOut, /warn/);
    context.assert.match(msgOut, /msg/);

    restoreAll();
});