/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from "../../src/models/file-template.ts";

test('FileTemplate: constructor - success', (context: TestContext) => {
    const templateFile: FileTemplate = new FileTemplate("name", "content");
    const templateFileWithoutContent: FileTemplate = new FileTemplate("name");

    context.assert.strictEqual(templateFile.name, "name");
    context.assert.strictEqual(templateFile.content, "content");
    context.assert.strictEqual(templateFileWithoutContent.name, "name");
    context.assert.strictEqual(templateFileWithoutContent.content, null);
});