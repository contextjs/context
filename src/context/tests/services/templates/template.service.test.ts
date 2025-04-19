/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { FileTemplate } from "../../../src/models/file-template.js";
import { TemplatesService } from "../../../src/services/templates/templates.service.js";

test("TemplatesService: abstract class contract - success", (context: TestContext) => {
    class TestTemplatesService extends TemplatesService {
        protected override readonly helpText = "Help text";
        public override templates: FileTemplate[] = [{ name: "test", content: "test" }];

        public override async displayHelpAsync(): Promise<void> {
            throw new Error("Method not implemented.");
        }
    }

    const service = new TestTemplatesService();

    context.assert.strictEqual((service as any).helpText, "Help text");
    context.assert.deepEqual(service.templates, [{ name: "test", content: "test" }]);
    context.assert.rejects(() => service.displayHelpAsync(), { message: "Method not implemented." });
});