/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Application, NullReferenceException } from "@contextjs/system";
import { test, TestContext } from "node:test";
import "../../src/extensions/application-extensions.ts";

test("Application: useConfiguration - success", (context: TestContext) => {
    const application = new Application();
    application.useConfiguration(() => { });

    context.assert.notStrictEqual(application.configuration, null);
});

test("Application: useConfiguration - throws if options is null", (context: TestContext) => {
    const application = new Application();

    context.assert.throws(() => { application.useConfiguration(null as any); }, NullReferenceException);
});
