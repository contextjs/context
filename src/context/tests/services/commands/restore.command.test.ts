/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, StringExtensions } from "@contextjs/system";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { RestoreCommand } from "../../../src/services/commands/restore.command.ts";

test('RestoreCommand: runAsync(--project) - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    process.argv = ['', '', 'restore', '--project'];

    const command = new Command(CommandType.Restore, []);
    const restoreCommand = new RestoreCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await restoreCommand.runAsync(command);
    } catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('RestoreCommand: runAsync(--p) - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    process.argv = ['', '', 'restore', '--p', 'api'];

    const command = new Command(CommandType.Restore, []);
    const restoreCommand = new RestoreCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await restoreCommand.runAsync(command);
    } catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
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
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const project = new Project('project1', 'path1');
    const restoreCommand = new RestoreCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await (restoreCommand as any).restoreAsync(project);
    } catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, /No context file found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});