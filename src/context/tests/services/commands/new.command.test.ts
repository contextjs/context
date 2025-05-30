/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, Path } from "@contextjs/io";
import { Console, ConsoleArgument, StringExtensions } from "@contextjs/system";
import childProcess from "child_process";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { NewCommand } from "../../../src/services/commands/new.command.ts";
import { TemplatesServiceResolver } from "../../../src/services/templates/templates-service-resolver.ts";

test('NewCommand: runAsync - success - displayHelp', async (context: TestContext) => {
    const expectedHelpText = `The "ctx new" command creates a ContextJS project based on a template.`;
    const originalOutput = Console['output'];
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    const command = new Command(CommandType.New, []);
    const newCommand = new NewCommand();
    await newCommand.runAsync(command);

    context.assert.match(logOutput, new RegExp(expectedHelpText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});


test('NewCommand: runAsync - invalid project type', async (context: TestContext) => {
    const originalOutput = Console['output'];
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'app', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, /Invalid project type "app"/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('NewCommand: runAsync - project type not supported', async (context: TestContext) => {
    const originalOutput = Console['output'];
    const originalExit = process.exit;
    const originalResolveAsync = TemplatesServiceResolver.resolveAsync;

    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    TemplatesServiceResolver.resolveAsync = async () => null;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, /The project type "api" is not supported/);

    TemplatesServiceResolver.resolveAsync = originalResolveAsync;
    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('NewCommand: runAsync - command help', async (context: TestContext) => {
    const expectedHelpText = `The "ctx new api" command creates a Web API project based on a template.`;

    const originalOutput = Console['output'];
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [] }, { name: '-h', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 0);
    context.assert.match(logOutput, new RegExp(expectedHelpText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('NewCommand: runAsync - path exists', async (context: TestContext) => {
    const projectName = 'pathexists';
    const originalPathExists = Path.exists;
    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    Path.exists = () => true;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [projectName] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 1);
    context.assert.match(logOutput, new RegExp(`The Project "${projectName}" already exists`));

    Path.exists = originalPathExists;
    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test('NewCommand: runAsync - success', async (context: TestContext) => {
    const projectName = 'testapi';
    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [] }, { name: '-n', values: [projectName] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();
    context.mock.method(childProcess, 'execSync', () => { });

    await newCommand.runAsync(command);

    context.assert.strictEqual(Directory.exists(projectName), true);
    
    Directory.delete(projectName);
});