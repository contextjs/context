/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File, Path } from "@contextjs/io";
import { Console, ObjectExtensions } from "@contextjs/system";
import childProcess from "child_process";
import test, { TestContext } from 'node:test';
import path from "path";
import { FileTemplate } from '../../src/models/file-template.js';
import { NewCommand, runAsync } from '../../src/services/new.command.js';
import { TemplateResolverService } from '../../src/services/templates/template-resolver.service.js';

const originalConsoleOutput = Console['output'];
const originalProcessExit = process.exit;
const originalPathExists = Path.exists;
const originalDirectoryCreate = Directory.create;
const originalFileSave = File.save;
const originalChildProcessExec = childProcess.execSync;
const originalRemoveLastLine = Console.removeLastLine;
const originalWriteLineFormatted = Console.writeLineFormatted;
const originalTemplateResolver = TemplateResolverService.resolveAsync;

function restorePatchedGlobals() {
    Console.setOutput(originalConsoleOutput);
    process.exit = originalProcessExit;
    Path.exists = originalPathExists;
    Directory.create = originalDirectoryCreate;
    File.save = originalFileSave;
    childProcess.execSync = originalChildProcessExec;
    Console.removeLastLine = originalRemoveLastLine;
    Console.writeLineFormatted = originalWriteLineFormatted;
    TemplateResolverService.resolveAsync = originalTemplateResolver;
}

test('NewCommand: runAsync - no arguments', async (context: TestContext) => {
    let capturedOutput = "";
    Console.setOutput((...args: any[]) => { capturedOutput += args.map(arg => String(arg)).join(' '); });
    const command = new NewCommand();
    const testContext = { parsedArguments: [] };
    await command.runAsync(testContext as any);

    context.assert.match(capturedOutput, /No arguments provided/);

    restorePatchedGlobals();
});

test('NewCommand: runAsync - no project type', async (context: TestContext) => {
    let capturedOutput = "";
    let capturedExitCode: number | undefined = undefined;
    Console.setOutput((...args: any[]) => { capturedOutput += args.map(arg => String(arg)).join(' '); });
    process.exit = ((code: number) => { capturedExitCode = code; throw new Error("ProcessExit"); }) as any;

    const command = new NewCommand();
    const testContext = { parsedArguments: [{ values: [''] }] };

    await context.assert.rejects(() => command.runAsync(testContext as any), /ProcessExit/);
    context.assert.match(capturedOutput, /No project type provided/);
    context.assert.strictEqual(capturedExitCode, 1);

    restorePatchedGlobals();
});

test('NewCommand: runAsync - unsupported type', async (context: TestContext) => {
    let capturedOutput = "";
    let capturedExitCode: number | undefined = undefined;
    Console.setOutput((...args: any[]) => { capturedOutput += args.map(arg => String(arg)).join(' '); });
    process.exit = ((code: number) => { capturedExitCode = code; throw new Error("ProcessExit"); }) as any;
    TemplateResolverService.resolveAsync = async () => null;

    const command = new NewCommand();
    const testContext = { parsedArguments: [{ values: ['unknown'] }] };

    await context.assert.rejects(() => command.runAsync(testContext as any), /ProcessExit/);
    context.assert.match(capturedOutput, /not supported/);
    context.assert.strictEqual(capturedExitCode, 1);

    restorePatchedGlobals();
});

test('NewCommand: runAsync - project/folder already exists', async (context: TestContext) => {
    let capturedOutput = "";
    let capturedExitCode: number | undefined = undefined;
    Console.setOutput((...args: any[]) => { capturedOutput += args.map(arg => String(arg)).join(' '); });
    process.exit = ((code: number) => { capturedExitCode = code; throw new Error("ProcessExit"); }) as any;
    TemplateResolverService.resolveAsync = async () => ({ templates: [new FileTemplate('foo.txt', 'hi')] });
    Path.exists = () => true;

    const command = new NewCommand();
    (command as any).getNameAsync = async () => "existing-project";
    const testContext = { parsedArguments: [{ values: ['webapi'] }] };

    await context.assert.rejects(() => command.runAsync(testContext as any), /ProcessExit/);
    context.assert.match(capturedOutput, /already exists/);
    context.assert.strictEqual(capturedExitCode, 1);

    restorePatchedGlobals();
});

test('NewCommand: runAsync - successful creation', async (context: TestContext) => {
    let capturedOutput = "";
    let createdDirectories: string[] = [];
    let writtenFiles: { path: string, content: string, overwrite: boolean }[] = [];
    let npmInstallInvoked = false;
    let removeLastLineCalled = false;
    let formattedMessages: string[] = [];

    Console.setOutput((...args: any[]) => { capturedOutput += args.map(arg => String(arg)).join(' '); });
    Console.removeLastLine = () => { removeLastLineCalled = true; };
    Console.writeLineFormatted = (msg: any, done?: any) => { formattedMessages.push((msg?.text || "") + (done?.text ? " " + done.text : "")); };
    childProcess.execSync = (() => { npmInstallInvoked = true; }) as any;
    Directory.create = ((dirPath: string) => { createdDirectories.push(dirPath); }) as any;
    File.save = ((filePath: string, fileContent: string, shouldOverwrite: boolean) => {
        writtenFiles.push({ path: filePath, content: fileContent, overwrite: shouldOverwrite });
    }) as any;
    Path.exists = () => false;
    TemplateResolverService.resolveAsync = async () => ({
        templates: [
            new FileTemplate('foo.txt', 'Hello {{name}}'),
            new FileTemplate('folder/', null)
        ]
    });

    const command = new NewCommand();
    (command as any).getNameAsync = async () => "myapp";
    const testContext = { parsedArguments: [{ values: ['webapi'] }] };

    await command.runAsync(testContext as any);

    context.assert.ok(createdDirectories.includes("myapp/folder/"));
    context.assert.ok(writtenFiles.some(f => f.path === "myapp/foo.txt" && f.content === "Hello myapp"));
    context.assert.ok(npmInstallInvoked);
    context.assert.ok(removeLastLineCalled);
    context.assert.ok(formattedMessages.some(m => m.includes("Done")));

    restorePatchedGlobals();
});

test('NewCommand: getNameAsync - name starts with number', async (context: TestContext) => {
    let errorOutput = "";
    let exitCode: number | undefined = undefined;
    Console.setOutput((...args: any[]) => { errorOutput += args.map(arg => String(arg)).join(' '); });
    process.exit = ((code: number) => { exitCode = code; throw new Error("ProcessExit"); }) as any;

    const command = new NewCommand();
    const testContext = {
        parsedArguments: [
            { name: '--name', values: ['1myproject'] }
        ]
    };

    await context.assert.rejects(() => (command as any).getNameAsync(testContext), /ProcessExit/);
    context.assert.match(errorOutput, /not valid/);
    context.assert.strictEqual(exitCode, 1);

    restorePatchedGlobals();
});

test('NewCommand: getNameAsync - name contains invalid chars', async (context: TestContext) => {
    let errorOutput = "";
    let exitCode: number | undefined = undefined;
    Console.setOutput((...args: any[]) => { errorOutput += args.map(arg => String(arg)).join(' '); });
    process.exit = ((code: number) => { exitCode = code; throw new Error("ProcessExit"); }) as any;

    const command = new NewCommand();
    const testContext = {
        parsedArguments: [
            { name: '--name', values: ['bad*chars'] }
        ]
    };

    await context.assert.rejects(() => (command as any).getNameAsync(testContext), /ProcessExit/);
    context.assert.match(errorOutput, /not valid/);
    context.assert.strictEqual(exitCode, 1);

    restorePatchedGlobals();
});

test('NewCommand: getNameAsync - uses basename when name arg missing', async (context: TestContext) => {
    const originalBasename = path.basename;
    path.basename = () => "MyFolder";
    const command = new NewCommand();
    const testContext = { parsedArguments: [{ name: '--unknown', values: [] }] };
    const resolvedName = await (command as any).getNameAsync(testContext);

    context.assert.strictEqual(resolvedName, 'MyFolder');

    path.basename = originalBasename;
});

test('runAsync: delegates to NewCommand', async (context: TestContext) => {
    let methodInvoked = false;
    const originalRunAsync = NewCommand.prototype.runAsync;
    NewCommand.prototype.runAsync = async function (ctx) { methodInvoked = true; return 'ok' as any; };

    const testContext = { parsedArguments: [] };
    const result = await runAsync(testContext as any);

    context.assert.strictEqual(methodInvoked, true);
    context.assert.strictEqual(result, 'ok');

    NewCommand.prototype.runAsync = originalRunAsync;
});