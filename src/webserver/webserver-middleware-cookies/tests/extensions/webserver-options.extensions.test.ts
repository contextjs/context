/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { IMiddleware, WebServerOptions } from "@contextjs/webserver";
import { test, TestContext } from "node:test";
import "../../src/extensions/webserver-options.extensions.ts";
import { StaticFilesMiddleware } from "../../src/static-files.middleware.js";

test("WebServerOptions: useStaticFiles registers StaticFilesMiddleware", (context: TestContext) => {
    const options = new WebServerOptions();

    let registered: unknown;
    context.mock.method(options, "useMiddleware", (middleware: IMiddleware) => {
        registered = middleware;
    });

    (options as unknown as { useStaticFiles(callback: (options: { publicFolder: string; fileExtensions: string[] }) => void): void })
        .useStaticFiles(options => {
            options.publicFolder = "static";
            options.fileExtensions = [".html"];
        });

    context.assert.ok(registered instanceof StaticFilesMiddleware);
    context.assert.strictEqual((registered as StaticFilesMiddleware).publicFolder, "static");
    context.assert.deepStrictEqual((registered as StaticFilesMiddleware).fileExtensions, [".html"]);
});
