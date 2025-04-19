/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { FileTemplate } from "../../src/models/file-template.js";
import { TsConfigTemplate } from "../../src/templates/tsconfig.json.template.js";

test("TsConfigTemplate: template definition - success", (context: TestContext) => {
    const template = TsConfigTemplate.template;

    context.assert.ok(template instanceof FileTemplate);
    context.assert.strictEqual(template.name, "tsconfig.json");
    context.assert.match(template.content!, /"outDir": "..\/_build\/{{name}}"/);
    context.assert.match(template.content!, /"target": "ESNext"/);
    context.assert.match(template.content!, /"module": "NodeNext"/);
    context.assert.match(template.content!, /"strict": true/);
    context.assert.match(template.content!, /"experimentalDecorators": true/);
    context.assert.match(template.content!, /"emitDecoratorMetadata": true/);
});