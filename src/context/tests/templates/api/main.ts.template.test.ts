/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { FileTemplate } from "../../../src/models/file-template.js";
import { MainTemplate } from "../../../src/templates/api/main.ts.template.js";

test("MainTemplate: template definition - success", (context: TestContext) => {
    const template = MainTemplate.template;

    context.assert.ok(template instanceof FileTemplate);
    context.assert.strictEqual(template.name, "src/main.ts");
    context.assert.match(template.content!, /Application/);
    context.assert.match(template.content!, /application\.onRun\(/);
    context.assert.match(template.content!, /application\.runAsync\(\);/);
});