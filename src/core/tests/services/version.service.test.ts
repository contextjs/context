/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { VersionService } from "../../src/services/version.service.ts";

test('VersionService: get - success', async (context: TestContext) => {
    const version = VersionService.get();
    context.assert.strictEqual(version, "0.1.1");
});

test('VersionService: display - success', async (context: TestContext) => {
    let consoleText = '';
    console.info = (message: string) => consoleText += message;

    VersionService.display();

    context.assert.match(consoleText, /ContextJS/);
});