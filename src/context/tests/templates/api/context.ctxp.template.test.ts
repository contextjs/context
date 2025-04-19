/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { ContextTemplate } from "../../../src/templates/api/context.ctxp.template.js";
import { FileTemplate } from "../../../src/models/file-template.js";

test("ContextTemplate: template definition - success", (context: TestContext) => {
    const template = ContextTemplate.template;

    context.assert.ok(template instanceof FileTemplate);
    context.assert.strictEqual(template.name, "context.ctxp");
    context.assert.match(template.content!, /"name": "{{name}}"/);
    context.assert.match(template.content!, /"main": "src\/main.ts"/);
});