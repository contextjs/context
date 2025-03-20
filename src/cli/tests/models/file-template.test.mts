/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { FileTemplate } from "../../src/models/file-template.mjs";

test('FileTemplate: constructor - success', (context: TestContext) => {
    const templateFile: FileTemplate =
    {
        name: "name",
        content: "content"
    }

    const templateFileWithoutContent: FileTemplate =
    {
        name: "name"
    }

    context.assert.strictEqual(templateFile.name, "name");
    context.assert.strictEqual(templateFile.content, "content");
    context.assert.strictEqual(templateFileWithoutContent.name, "name");
    context.assert.strictEqual(templateFileWithoutContent.content, undefined);
});