/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { Directory, File } from "@contextjs/io";
import fs from "node:fs";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { BuildCommand } from "../../../src/services/commands/build.command.ts";

test('BuildCommand: runAsync(--project) - success', async (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'build', '--project',];

    const command: Command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await buildCommand.runAsync(command);

    context.assert.strictEqual(logOutput, 'No projects found. Exiting...');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('BuildCommand: runAsync(--p) - success', async (context: TestContext) => {
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    process.argv = [StringExtensions.empty, StringExtensions.empty, 'build', '--p', ''];

    const command: Command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await buildCommand.runAsync(command);

    context.assert.strictEqual(logOutput, 'No projects found. Exiting...');
    context.assert.strictEqual(exitCode, 1);

    console.log = originalLog;
    process.exit = originalExit;
});

test('BuildCommand: runAsync - success', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const command: Command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();
    const projects = [new Project('project1', 'path1')];

    context.mock.method(buildCommand as any, 'getProjects', () => projects);
    context.mock.method(buildCommand as any, 'buildAsync', () => void 0);

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await buildCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 0);
});

test('BuildCommand: build - success', async (context: TestContext) => {
    const originalLog = console.error;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;
    const project = new Project('project1', 'path1');

    const buildCommand = new BuildCommand();

    console.error = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await (buildCommand as any).buildAsync(project);

    context.assert.strictEqual(logOutput, 'No project file found. Exiting...');
    context.assert.strictEqual(exitCode, 1);

    console.error = originalLog;
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