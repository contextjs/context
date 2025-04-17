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
    let output = StringExtensions.empty;
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    Console.setOutput((...args: any[]) => {
        output += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        processExitCode = code;
        throw new Error(`exit:${code}`);
    };

    const consoleArguments: ConsoleArgument[] = [
        { name: 'project', values: ['test'] }
    ];

    const command = new Command(CommandType.Watch, consoleArguments);
    const watchCommand = new WatchCommand();

    let threw: Error | null = null;
    try {
        await watchCommand.runAsync(command);
    } 
    catch (err) {
        threw = err as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(output, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('WatchCommand: runAsync - success', async (context: TestContext) => {
    let output = StringExtensions.empty;
    const originalOutput = Console['output'];
    const originalExit = process.exit;

    Console.setOutput((...args: any[]) => {
        output += args.map(arg => String(arg)).join(' ') + '\n';
    });

    const command = new Command(CommandType.Watch, []);
    const watchCommand = new WatchCommand();
    const projects: Project[] = [new Project('test', 'test')];

    context.mock.method(watchCommand as any, 'getProjects', () => projects);
    context.mock.method(watchCommand as any, 'watchProject', () => {
        Console.writeLineInfo('Watching project test for changes...');
    });

    await watchCommand.runAsync(command);

    context.assert.match(output, /Watching project test for changes/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('watchProject_Success', async (context: TestContext) => {
    let output = '';
    const watchCommand = new WatchCommand();
    const originalOutput = Console['output'];
    const originalExit = process.exit;

    const project: Project = new Project('test', 'src/system');

    Console.setOutput((...args: any[]) => {
        output += args.map(arg => String(arg)).join(' ') + '\n';
    });

    const watcher = (watchCommand as any).watchProject(project);
    watcher?.close();

    context.assert.match(output, /Watching project "test" for changes/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});