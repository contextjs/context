/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument, StringExtensions } from "@contextjs/core";
import test, { TestContext } from 'node:test';
import typescript from "typescript";
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { WatchCommand } from "../../../src/services/commands/watch.command.ts";

test('WatchCommand: runAsync - no projects', async (context: TestContext) => {
    let processExitCode = -100;
    let errorOutput = StringExtensions.empty;

    process.exit = (code: number) => {
        processExitCode = code;
        return undefined as never;
    };

    console.error = (message: string) => errorOutput = message;

    const consoleArguments: ConsoleArgument[] = [
        { name: 'project', values: ['test'] }
    ];

    const command = new Command(CommandType.Watch, consoleArguments);
    const watchCommand = new WatchCommand();
    await watchCommand.runAsync(command);

    context.assert.strictEqual(processExitCode, 1);
    context.assert.strictEqual(errorOutput, 'No projects found. Exiting...');
});

test('WatchCommand: runAsync - success', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    const command = new Command(CommandType.Watch, []);
    const watchCommand = new WatchCommand();
    const projects: Project[] = [
        new Project('test', 'test')
    ];

    console.log = (message: string) => logOutput = message;

    context.mock.method(watchCommand as any, 'getProjectDescriptors', () => projects);
    context.mock.method(watchCommand as any, 'watchProject', () => { console.log(`Watching project "test" for changes...`); });
    await watchCommand.runAsync(command);

    context.assert.strictEqual(logOutput, 'Watching project "test" for changes...');
});

test('watchProject_Success', async (context: TestContext) => {
    let logOutput = '';
    let watchCommand = new WatchCommand();

    const project: Project = new Project('test', 'src/core');
    console.log = (message: string) => { if (!logOutput) logOutput = message; }

    const watcher = (watchCommand as any).watchProject(project);
    context.assert.strictEqual(logOutput, `Watching project "${project.name}" for changes...`);
    watcher?.close();
});