/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { RestoreCommand } from "../../../src/services/commands/restore.command.ts";

test('RestoreCommand: runAsync(--project) - success', async (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'restore', '--project',];

    const command: Command = new Command(CommandType.Restore, []);
    const restoreCommand = new RestoreCommand();

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await restoreCommand.runAsync(command);

    context.assert.strictEqual(logOutput, '\x1b[31mNo projects found. Exiting...\x1b[39m');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('RestoreCommand: runAsync(--p) - success', async (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'restore', '--p', 'api'];

    const command: Command = new Command(CommandType.Restore, []);
    const restoreCommand = new RestoreCommand();

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await restoreCommand.runAsync(command);

    context.assert.strictEqual(logOutput, '\x1b[31mNo projects found. Exiting...\x1b[39m');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('RestoreCommand: runAsync - success', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const command: Command = new Command(CommandType.Restore, []);
    const restoreCommand = new RestoreCommand();
    const projects = [new Project('project1', 'path1')];

    context.mock.method(restoreCommand as any, 'getProjects', () => projects);
    context.mock.method(restoreCommand as any, 'restoreAsync', () => void 0);

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await restoreCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 0);
});

test('RestoreCommand: restore - success', async (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const project = new Project('project1', 'path1');

    const restoreCommand = new RestoreCommand();

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await (restoreCommand as any).restoreAsync(project);

    context.assert.strictEqual(logOutput, '\x1b[31mNo context file found. Exiting...\x1b[39m');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});