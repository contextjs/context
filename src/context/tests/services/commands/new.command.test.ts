/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument, StringExtensions } from "@contextjs/core";
import { Directory, Path } from "@contextjs/io";
import childProcess from "child_process";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { NewCommand } from "../../../src/services/commands/new.command.ts";
import { TemplatesServiceResolver } from "../../../src/services/templates/templates-service-resolver.ts";

test('NewCommand: runAsync - success - displayHelp', async (context: TestContext) => {
    const helpText = `The "ctx new" command creates a ContextJS project based on a template.
Usage: ctx new [options]

Command         Template Name           Description
--------        ----------------        -----------------------------------------------------
api             Web API project         A Web API project containing controllers and actions.
`;

    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();
    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 0);
    context.assert.strictEqual(logOutput, helpText);
});

test('NewCommand: runAsync - invalid project type', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'app', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(exitCode, 1);
    context.assert.strictEqual(logOutput, '\x1b[31mInvalid project type "app".\x1b[39m');
});

test('NewCommand: runAsync - project type not supported', async (context: TestContext) => {
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    const originalResolveAsync = TemplatesServiceResolver.resolveAsync;
    TemplatesServiceResolver.resolveAsync = async () => null;
    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(logOutput, '\x1b[31mThe project type "api" is not supported.\x1b[39m');
    context.assert.strictEqual(exitCode, 1);

    TemplatesServiceResolver.resolveAsync = originalResolveAsync;
});

test('NewCommand: runAsync - command help', async (context: TestContext) => {
    const helpText = `The "ctx new api" command creates a Web API project based on a template.
Usage: ctx new api [options]

Options             Description
------------        -----------------------------------------------------
[no option]         Creates a project with current directory name as project name.
-n, --name          The name of the project to create.
`;

    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [] }, { name: '-h', values: [] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(logOutput, helpText);
    context.assert.strictEqual(exitCode, 0);
});

test('NewCommand: runAsync - path exists', async (context: TestContext) => {
    const projectName = 'pathexists';
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const originalPathExists = Path.exists;
    Path.exists = () => true;
    const consoleArguments: ConsoleArgument[] = [{ name: 'api', values: [projectName] }];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(logOutput, `\x1b[31mThe Project "${projectName}" already exists. Exiting...\x1b[39m`);
    context.assert.strictEqual(exitCode, 1);

    Path.exists = originalPathExists;
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