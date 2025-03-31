/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleArgument, StringExtensions } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import typescript from "typescript";
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { CommandBase } from "../../../src/services/commands/command-base.ts";
import { NewCommand } from '../../../src/services/commands/new.command.ts';

test('CommandBase: runAsync - success', async (context: TestContext) => {
    let value = 0;
    const command = new Command(CommandType.Build, []);

    class TestCommand extends CommandBase {
        public async runAsync(command: Command): Promise<void> {
            value = 1;
        }
    }

    const testCommand = new TestCommand();
    await testCommand.runAsync(command);

    context.assert.strictEqual(value, 1);
});

test('CommandBase: processDiagnostics - success', (context: TestContext) => {
    const project: Project = new Project('test', 'test');
    const diagnostics: typescript.Diagnostic[] | readonly typescript.Diagnostic[] = [{
        code: 0,
        messageText: 'test',
        category: typescript.DiagnosticCategory.Error,
        file: undefined,
        start: undefined,
        length: undefined
    }];

    class TestCommand extends CommandBase {
        public async runAsync(command: Command): Promise<void> {
            this.processDiagnostics(project, diagnostics);
        }
    }

    const testCommand = new TestCommand();
    testCommand.runAsync(new Command(CommandType.Build, []));
});

test('CommandBase: checkForHelpCommandAsync - success', async (context: TestContext) => {
    const outputText = `The "ctx new" command creates a ContextJS project based on a template.
Usage: ctx new [options]

Command         Template Name           Description
--------        ----------------        -----------------------------------------------------
api             Web API project         A Web API project containing controllers and actions.
`;
    const originalLog = console.log;
    const originalExit = process.exit;

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };
    
    const command = new Command(CommandType.New, []);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.strictEqual(logOutput, outputText);
    context.assert.strictEqual(exitCode, 0);

    console.log = originalLog;
    process.exit = originalExit;
});
