/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ProjectType } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { APITemplatesService } from "../../../src/services/templates/api-templates.service.js";
import { TemplatesServiceResolver } from "../../../src/services/templates/templates-service-resolver.js";

test("TemplatesServiceResolver: resolveAsync() returns APITemplatesService for ProjectType.API", async (context: TestContext) => {
    const service = await TemplatesServiceResolver.resolveAsync(ProjectType.API);

    context.assert.ok(service, "Expected a TemplatesService instance to be returned");
    context.assert.ok(service instanceof APITemplatesService, "Expected instance of APITemplatesService");
});

test("TemplatesServiceResolver: resolveAsync() returns null for unknown ProjectType", async (context: TestContext) => {
    const invalidProjectType = -1 as unknown as ProjectType;
    const service = await TemplatesServiceResolver.resolveAsync(invalidProjectType);

    context.assert.strictEqual(service, null, "Expected null for unknown project type");
});