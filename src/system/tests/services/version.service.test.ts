/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { VersionService } from "../../src/services/version.service.ts";
import { Console } from "../../src/services/console.ts";

const CURRENT_VERSION = "0.5.0-alpha.1";

test('VersionService: get - success', async (context: TestContext) => {
    const version = VersionService.get();
    context.assert.strictEqual(version, CURRENT_VERSION);
});

test('VersionService: display - success', async (context: TestContext) => {
    let consoleText = '';
    Console.setOutput((message: string) => consoleText += message + '\n');

    VersionService.display();

    context.assert.match(consoleText, /Node: v?\d+\.\d+\.\d+/);
    context.assert.match(consoleText, /OS: (linux|darwin|win32)/);
    context.assert.match(consoleText, /____/);

    Console.resetOutput();
});