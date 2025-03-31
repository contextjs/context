/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, ConsoleArgument, StringExtensions } from "@contextjs/system";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { WatchCommand } from "../../../src/services/commands/watch.command.ts";

test('WatchCommand: runAsync - no projects', async (context: TestContext) => {
    let processExitCode = -100;
    let errorOutput = StringExtensions.empty;
    const originalLog = console.log;
    const originalExit = process.exit;

    process.exit = (code: number) => {
        processExitCode = code;
        return undefined as never;
    };
    console.log = (message: string) => errorOutput = message;

    const consoleArguments: ConsoleArgument[] = [
        { name: 'project', values: ['test'] }
    ];

    const command = new Command(CommandType.Watch, consoleArguments);
    const watchCommand = new WatchCommand();
    await watchCommand.runAsync(command);

    context.assert.strictEqual(processExitCode, 1);
    context.assert.strictEqual(errorOutput, '\x1b[31mNo projects found. Exiting...\x1b[39m');

    console.log = originalLog;
    process.exit = originalExit;
});

test('WatchCommand: runAsync - success', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    const command = new Command(CommandType.Watch, []);
    const watchCommand = new WatchCommand();
    const projects: Project[] = [
        new Project('test', 'test')
    ];
    const originalLog = console.log;
    const originalExit = process.exit;

    console.log = (message: string) => logOutput = message;

    context.mock.method(watchCommand as any, 'getProjects', () => projects);
    context.mock.method(watchCommand as any, 'watchProject', () => { Console.writeLineInfo('Watching project test for changes...'); });
    await watchCommand.runAsync(command);

    context.assert.strictEqual(logOutput, '\x1b[34mWatching project test for changes...\x1b[39m');

    console.log = originalLog;
    process.exit = originalExit;
});

test('watchProject_Success', async (context: TestContext) => {
    let logOutput = '';
    let watchCommand = new WatchCommand();
    const originalLog = console.log;
    const originalExit = process.exit;

    const project: Project = new Project('test', 'src/system');
    console.log = (message: string) => { if (!logOutput) logOutput = message; }

    const watcher = (watchCommand as any).watchProject(project);
    watcher?.close();

    context.assert.strictEqual(logOutput, '\x1b[34mWatching project "test" for changes...\x1b[39m');

    console.log = originalLog;
    process.exit = originalExit;
});