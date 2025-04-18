/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, StringExtensions } from '@contextjs/system';
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

    const fakeFile: typescript.SourceFile = typescript.createSourceFile(
        'test.ts',
        'let x: number = "string";',
        typescript.ScriptTarget.ESNext
    );

    const diagnostics: typescript.Diagnostic[] = [
        {
            code: 1234,
            messageText: 'Type error',
            category: typescript.DiagnosticCategory.Error,
            file: fakeFile,
            start: 13,
            length: 1
        },
        {
            code: 0,
            messageText: 'Simple message',
            category: typescript.DiagnosticCategory.Message,
            file: undefined,
            start: undefined,
            length: undefined
        }
    ];

    let output = '';
    const originalOutput = Console['output'];
    Console.setOutput((...args: any[]) => {
        output += args.join(' ') + '\n';
    });

    const testCommand = new (class extends CommandBase {
        public async runAsync(command: Command): Promise<void> {
            this.processDiagnostics(project, diagnostics);
        }
    })();

    testCommand.runAsync(new Command(CommandType.Build, []));

    context.assert.match(output, /test: test\.ts \(1,14\): Type error/);
    context.assert.match(output, /test: Simple message/);

    Console.setOutput(originalOutput);
});

test('CommandBase: tryDisplayHelpAsync - success', async (context: TestContext) => {
    const expectedHelp = `The "ctx new" command creates a ContextJS project based on a template.
Usage: ctx new [options]

Command         Template Name           Description
--------        ----------------        -----------------------------------------------------
api             Web API project         A Web API project containing controllers and actions.
`;

    const originalExit = process.exit;
    const originalOutput = Console['output'];

    let logOutput = StringExtensions.empty;
    let exitCode = 0;

    Console.setOutput((...args: any[]) => {
        logOutput += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    const command = new Command(CommandType.New, []);
    const newCommand = new NewCommand();

    await newCommand.runAsync(command);

    context.assert.match(logOutput, new RegExp(expectedHelp.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    context.assert.strictEqual(exitCode, 0);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});
