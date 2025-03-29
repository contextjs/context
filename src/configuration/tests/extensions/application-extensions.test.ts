/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application } from "@contextjs/core";
import { test, TestContext } from 'node:test';
import '../../src/extensions/application-extensions.ts';

test('Application: useConfiguration - success', (context: TestContext) => {
    const app = new Application();
    app.useConfiguration(() => { });

    context.assert.notStrictEqual(app.configuration, null);
});