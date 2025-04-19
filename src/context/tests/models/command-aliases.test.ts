/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CommandAliases } from "../../src/models/command-aliases.js";

test("CommandAliases: contains all expected aliases", (context: TestContext) => {
    context.assert.equal(CommandAliases["-n"], "new");
    context.assert.equal(CommandAliases["-b"], "build");
    context.assert.equal(CommandAliases["-r"], "restore");
    context.assert.equal(CommandAliases["-w"], "watch");
    context.assert.equal(CommandAliases["-v"], "version");
});

test("CommandAliases: returns undefined for unknown alias", (context: TestContext) => {
    context.assert.equal(CommandAliases["--bad"], undefined);
    context.assert.equal(CommandAliases[""], undefined);
});