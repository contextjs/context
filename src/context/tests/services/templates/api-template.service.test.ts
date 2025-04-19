/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, StringExtensions } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { APITemplatesService } from '../../../src/services/templates/api-templates.service.js';

test('APITemplatesService: displayHelp - success', async (context: TestContext) => {
    const expectedHelpText = `The "ctx new api" command creates a Web API project based on a template.
Usage: ctx new api [options]

Options             Description
------------        -----------------------------------------------------
[no option]         Creates a project with current directory name as project name.
-n, --name          The name of the project to create.`;

    let output = StringExtensions.empty;
    let exitCode = -1;

    const originalExit = process.exit;
    const originalOutput = Console['output'];

    Console.setOutput((...args: any[]) => {
        output += args.map(String).join(' ') + '\n';
    });

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    let threw: Error | null = null;

    try {
        await new APITemplatesService().displayHelpAsync();
    } catch (err) {
        threw = err as Error;
    }

    const stripAnsi = (text: string): string =>
        text.replace(/\x1B\[[0-9;]*m/g, '');

    const cleanOutput = stripAnsi(output);
    const helpTextStart = cleanOutput.indexOf('The "ctx new api" command');
    const actualHelpText = helpTextStart !== -1
        ? cleanOutput.slice(helpTextStart).trim()
        : cleanOutput.trim();

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:0/);
    context.assert.strictEqual(actualHelpText, expectedHelpText);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});