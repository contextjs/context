/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import typescript from "typescript";
import { Command } from "../../../src/models/command.ts";
import { CommandType } from "../../../src/models/command-type.ts";
import { Project } from "../../../src/models/project.ts";
import { CommandBase } from "../../../src/services/commands/command-base.ts";

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