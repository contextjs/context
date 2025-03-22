/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { ConsoleArgument, PathService, ProjectType, StringExtensions } from "@contextjs/core";
import test, { TestContext } from 'node:test';
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { CLIService } from "../../../src/services/cli.service.ts";
import { NewCommand } from "../../../src/services/commands/new.command.ts";

test('NewCommand: runAsync - success', async (context: TestContext) => {
    const consoleArguments: ConsoleArgument[] = [
        { name: 'name', values: ['test'] },
        { name: 'type', values: ['api'] }
    ];
    const command = new Command(CommandType.New, consoleArguments);
    const newCommand = new NewCommand() as any;

    context.mock.method(newCommand, 'createProject', () => void 0);
    PathService.directoryIsEmpty = () => true;

    await newCommand.runAsync(command);
    newCommand.consoleInterface.close();

    context.assert.strictEqual(newCommand['name'], 'test');
    context.assert.strictEqual(newCommand['type'], ProjectType.API);
});

test('NewCommand: createProject - success', async (context: TestContext) => {
    const newCommand = new NewCommand() as any;
    newCommand['name'] = 'test';
    newCommand['type'] = ProjectType.API;
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    context.mock.method(newCommand, 'createTemplates', () => { });
    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    newCommand.createProject();
    newCommand.consoleInterface.close();

    context.assert.strictEqual(exitCode, 0);
});

test('NewCommand: createTemplates - project exists', async (context: TestContext) => {
    const newCommand = new NewCommand() as any;
    newCommand['name'] = 'test';
    newCommand['type'] = ProjectType.API;
    let logOutput = StringExtensions.empty;
    let exitCode = -100;

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };
    console.error = (message: string) => logOutput = message;
    context.mock.method(PathService, 'exists', () => true);

    newCommand.createTemplates();
    newCommand.consoleInterface.close();

    context.assert.strictEqual(exitCode, 1);
    context.assert.strictEqual(logOutput, 'The Project "test" already exists. Exiting...');
});

test('NewCommand: getProjectTypeAsync - success', async (context: TestContext) => {
    const newCommand = new NewCommand() as any;
    newCommand['type'] = ProjectType.API;

    await newCommand.getProjectTypeAsync();
    newCommand.consoleInterface.close();

    context.assert.strictEqual(newCommand['type'], ProjectType.API);
});

test('NewCommand: getProjectTypeAsync - prompt', async (context: TestContext) => {
    const newCommand = new NewCommand() as any;
    let logOutput = StringExtensions.empty;

    console.log = (message: string) => logOutput += message;
    context.mock.method(newCommand.consoleInterface, 'question', () => "0");

    await newCommand.getProjectTypeAsync();
    newCommand.consoleInterface.close();

    context.assert.match(logOutput, /Project Type:/);
});