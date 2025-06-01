/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { VersionService } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { FileTemplate } from "../../../src/models/file-template.js";
import { PackageTemplate } from "../../../src/templates/api/package.json.template.js";

test("PackageTemplate: template definition - success", (context: TestContext) => {
    const template = PackageTemplate.template;

    context.assert.ok(template instanceof FileTemplate);
    context.assert.strictEqual(template.name, "package.json");

    const version = VersionService.get();
    context.assert.match(template.content!, new RegExp(`"@contextjs/webserver":\\s*"${version}"`));
    context.assert.match(template.content!, /"name": "{{name}}"/);
    context.assert.match(template.content!, /"type": "module"/);
});