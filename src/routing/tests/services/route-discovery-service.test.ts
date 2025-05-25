/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import fs from "fs";
import test, { TestContext } from "node:test";
import os from "os";
import path from "path";
import "reflect-metadata";
import { RouteDefinition } from "../../src/models/route-definition.js";
import { RouteInfo } from "../../src/models/route-info.js";
import { RouteDiscoveryService } from "../../src/services/route-discovery-service.js";

function withTempDir<T>(action: (dir: string) => T | Promise<T>): T | Promise<T> {
    const tempRoot = os.tmpdir();
    const tempDir = fs.mkdtempSync(path.join(tempRoot, "rds-test-"));
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ type: "module" }));
    let actionResult: any;

    try {
        actionResult = action(tempDir);
    }
    catch (err) {
        process.chdir(originalCwd);
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw err;
    }

    if (actionResult && typeof actionResult.then === "function")
        return (actionResult as Promise<T>).finally(() => {
            process.chdir(originalCwd);
            fs.rmSync(tempDir, { recursive: true, force: true });
        });
    else {
        process.chdir(originalCwd);
        fs.rmSync(tempDir, { recursive: true, force: true });
        return actionResult;
    }
}

test("RouteDiscoveryService: getCurrentDirectory throws if tsconfig.json is missing", (context: TestContext) => {
    withTempDir(() => {
        context.assert.throws(() => {
            // @ts-ignore private
            RouteDiscoveryService["getCurrentDirectory"]();
        });
    });
});

test("RouteDiscoveryService: getCurrentDirectory returns outDir when configured", (context: TestContext) => {
    withTempDir(() => {
        const configPath = path.join(process.cwd(), "tsconfig.json");
        fs.writeFileSync(configPath, JSON.stringify({ compilerOptions: { outDir: "dist-folder" } }));
        // @ts-ignore private
        const directory = RouteDiscoveryService["getCurrentDirectory"]();

        context.assert.strictEqual(directory, path.normalize("dist-folder"));
    });
});

test("RouteDiscoveryService: getCurrentDirectory defaults to '.' when outDir missing", (context: TestContext) => {
    withTempDir(() => {
        const configPath = path.join(process.cwd(), "tsconfig.json");
        fs.writeFileSync(configPath, JSON.stringify({ compilerOptions: {} }));
        // @ts-ignore private
        const directory = RouteDiscoveryService["getCurrentDirectory"]();

        context.assert.strictEqual(directory, path.normalize("."));
    });
});

test("RouteDiscoveryService: discoverRoutesAsync returns empty array when no .js/.mjs files", async (context: TestContext) => {
    await withTempDir(async () => {
        const configPath = path.join(process.cwd(), "tsconfig.json");
        fs.writeFileSync(configPath, JSON.stringify({ compilerOptions: {} }));
        const discovered = await RouteDiscoveryService.discoverRoutesAsync();

        context.assert.deepStrictEqual(discovered, []);
    });
});

test("RouteDiscoveryService: discoverRoutesAsync skips modules that throw on import", async (context: TestContext) => {
    await withTempDir(async () => {
        const configPath = path.join(process.cwd(), "tsconfig.json");
        fs.writeFileSync(configPath, JSON.stringify({ compilerOptions: {} }));
        const controllersDir = path.join(process.cwd(), "controllers");
        fs.mkdirSync(controllersDir, { recursive: true });
        fs.writeFileSync(path.join(controllersDir, "bad.js"), `throw new Error("import failed");`);
        const discovered = await RouteDiscoveryService.discoverRoutesAsync();

        context.assert.deepStrictEqual(discovered, []);
    });
});

// test("RouteDiscoveryService: discoverRoutesAsync finds decorated routes", async (context: TestContext) => {
//     await withTempDir(async () => {
//         // 1) Minimal tsconfig
//         fs.writeFileSync(path.join(process.cwd(), "tsconfig.json"),
//             JSON.stringify({ compilerOptions: {} }));

//         // 2) Stub the decorator exactly like your real one
//         const decoratorDir = path.join(process.cwd(), "src", "decorators");
//         fs.mkdirSync(decoratorDir, { recursive: true });
//         fs.writeFileSync(
//             path.join(decoratorDir, "route.decorator.js"),
//             `
// export const ROUTE_META = Symbol("route_meta");
// export function Route(template, name) {
//   return (target, key, descriptor) => {
//     Reflect.defineMetadata(ROUTE_META, { template, name }, descriptor.value);
//   };
// }
// `
//         );

//         // 3) Write a controller that uses it
//         const controllersDir = path.join(process.cwd(), "controllers");
//         fs.mkdirSync(controllersDir, { recursive: true });
//         fs.writeFileSync(
//             path.join(controllersDir, "temp.controller.js"),
//             `
// import { Route } from "../src/decorators/route.decorator.js";

// export class TempCtrl {
//   test() {}
// }

// // Apply decorator manually
// Route("/foo","fooName")(
//   TempCtrl.prototype,
//   "test",
//   Object.getOwnPropertyDescriptor(TempCtrl.prototype, "test")
// );
// `
//         );

//         // 4) Discover
//         const discovered = await RouteDiscoveryService.discoverRoutesAsync();
//         context.assert.strictEqual(discovered.length, 1, "should find exactly one route");

//         const routeDef = discovered[0] as RouteDefinition;

//         context.assert.ok(
//             routeDef.importPath.endsWith("controllers/temp.controller.js"),
//             "importPath should point at temp.controller.js"
//         );
//         context.assert.strictEqual(routeDef.className, "TempCtrl");
//         context.assert.strictEqual(routeDef.methodName, "test");
//         context.assert.strictEqual(routeDef.isMethodNameAsync, false);
//         context.assert.ok(routeDef.route instanceof RouteInfo);
//         context.assert.strictEqual(routeDef.route.template, "/foo");
//         context.assert.strictEqual(routeDef.route.name, "fooName");
//     });
// });