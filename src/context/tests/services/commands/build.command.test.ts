/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File } from "@contextjs/io";
import { Console, StringExtensions } from "@contextjs/system";
import fs from "node:fs";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { BuildCommand } from "../../../src/services/commands/build.command.ts";

test('BuildCommand: runAsync(--project) - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    process.argv = ['', '', 'build', '--project'];
    const command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await buildCommand.runAsync(command);
    }
    catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(logOutput, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});



test('BuildCommand: runAsync(--p) - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    process.argv = ['', '', 'build', '--p', ''];
    const command: Command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await buildCommand.runAsync(command);
    }
    catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(logOutput, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('BuildCommand: runAsync - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    const command: Command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();
    const projects = [new Project('project1', 'path1')];

    context.mock.method(buildCommand as any, 'getProjects', () => projects);
    context.mock.method(buildCommand as any, 'buildAsync', () => void 0);

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await buildCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 0);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});


test('BuildCommand: build - success', async (context: TestContext) => {
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const project = new Project('project1', 'path1');

    const buildCommand = new BuildCommand();

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await (buildCommand as any).buildAsync(project);
    }
    catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(logOutput, /No context file found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('BuildCommand: copyFiles - success', (context: TestContext) => {
    context.mock.method(Directory, 'exists', () => true);
    context.mock.method(File, 'read', () => JSON.stringify({ files: [{ from: 'from1', to: 'to1' }] }));
    context.mock.method(fs, 'existsSync', () => true);
    context.mock.method(fs, 'cpSync', () => void 0);

    const project = new Project('project1', 'path1');
    const buildCommand = new BuildCommand();

    context.assert.doesNotThrow(() => (buildCommand as any).copyFiles(project));
});