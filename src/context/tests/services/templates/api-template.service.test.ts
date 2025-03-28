/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/core';
import test, { TestContext } from 'node:test';
import { APITemplatesService } from '../../../src/services/templates/api-templates.service.js';

test('APITemplatesService: displayHelp - success', async (context: TestContext) => {
    const expectedHelpText = `The "ctx new api" command creates a Web API project based on a template.
Usage: ctx new api [options]

Options             Description
------------        -----------------------------------------------------
[no option]         Creates a project with current directory name as project name.
-n, --name          The name of the project to create.
`;

    const originalLog = console.log;
    const originalExit = process.exit;
    let logOutput = StringExtensions.empty;
    let exitCode = -100;
    console.log = (message: string) => logOutput = message;
    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    await new APITemplatesService().displayHelpAsync();

    context.assert.strictEqual(exitCode, 0);
    context.assert.strictEqual(logOutput, expectedHelpText);

    console.log = originalLog;
    process.exit = originalExit;
});