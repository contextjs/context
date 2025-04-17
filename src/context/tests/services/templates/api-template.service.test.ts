/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from '@contextjs/system';
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

    const originalExit = process.exit;
    const originalOutput = Console['output'];
    let output = '';
    let exitCode = -1;

    const stripAnsi = (text: string): string => text.replace(/\x1B\[[0-9;]*m/g, '');

    Console.setOutput((...args: any[]) => {
        output += args.map(arg => String(arg)).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        return undefined as never;
    };

    try {
        await new APITemplatesService().displayHelpAsync();
    }
    catch { }

    const cleanOutput = stripAnsi(output);
    const helpTextIndex = cleanOutput.indexOf('The "ctx new api" command');
    const justHelpText = helpTextIndex !== -1 ? cleanOutput.slice(helpTextIndex).trim() : '';

    context.assert.strictEqual(exitCode, 0);
    context.assert.strictEqual(justHelpText, expectedHelpText.trim());

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});
