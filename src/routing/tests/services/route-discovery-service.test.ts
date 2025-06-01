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
import { RouteDiscoveryService } from "../../src/services/route-discovery-service.js";

function withTempDir<T>(action: (dir: string) => T | Promise<T>): Promise<T> {
    const tempRoot = os.tmpdir();
    const tempDir = fs.mkdtempSync(path.join(tempRoot, "rds-test-"));
    const originalCwd = process.cwd();
    process.chdir(tempDir);
    fs.writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({ type: "module" }));

    let result: T | Promise<T>;
    try {
        result = action(tempDir);
    } catch (err) {
        process.chdir(originalCwd);
        fs.rmSync(tempDir, { recursive: true, force: true });
        throw err;
    }

    // Always return a Promise, handle sync/async transparently
    return Promise.resolve(result)
        .finally(() => {
            process.chdir(originalCwd);
            fs.rmSync(tempDir, { recursive: true, force: true });
        });
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
        const directory = RouteDiscoveryService["getProjectOutputDirectory"]();

        context.assert.strictEqual(directory, path.normalize("dist-folder"));
    });
});

test("RouteDiscoveryService: getCurrentDirectory defaults to '.' when outDir missing", (context: TestContext) => {
    withTempDir(() => {
        const configPath = path.join(process.cwd(), "tsconfig.json");
        fs.writeFileSync(configPath, JSON.stringify({ compilerOptions: {} }));
        // @ts-ignore private
        const directory = RouteDiscoveryService["getProjectOutputDirectory"]();

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