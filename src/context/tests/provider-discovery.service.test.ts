/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Console } from "@contextjs/system";
import fs from "fs";
import test, { TestContext } from "node:test";
import os from "os";
import path from "path";
import { ICommandManifest } from "../src/interfaces/i-command-manifest.js";
import { ProviderDiscoveryService } from "../src/services/provider-discovery.service.js";

function dictionaryToObject<T>(dictionary: Dictionary<string, T>): Record<string, T> {
    const result: Record<string, T> = {};

    for (const [key, value] of dictionary)
        result[key] = value;

    return result;
}

async function withIsolatedNodeModulesAsync(
    setupNodeModules: (nodeModulesDir: string) => Promise<void> | void,
    runTest: (nodeModulesDir: string) => Promise<void> | void) {
    const tempRootDir = fs.mkdtempSync(path.join(os.tmpdir(), "ctxtest-nm-"));
    const nodeModulesDir = path.join(tempRootDir, "node_modules");
    fs.mkdirSync(nodeModulesDir, { recursive: true });

    try {
        await setupNodeModules(nodeModulesDir);
        await runTest(nodeModulesDir);
    }
    finally {
        fs.rmSync(tempRootDir, { recursive: true, force: true });
    }
}

function overrideCwd(context: TestContext, cwdPath: string) {
    const originalCwd = process.cwd;
    process.cwd = () => cwdPath;
    context.after(() => { process.cwd = originalCwd; });
}

function captureConsoleWarnings(context: TestContext) {
    let warningList: string[] = [];
    const originalWarning = Console.writeLineWarning;
    Console.writeLineWarning = (msg: string) => { warningList.push(msg); };
    context.after(() => { Console.writeLineWarning = originalWarning; });
    return () => warningList;
}

test("ProviderDiscoveryService: returns empty if no local node_modules", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async () => { },
        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const providers = ProviderDiscoveryService.discover(false);
            context.assert.deepStrictEqual(Array.from(providers), []);
        }
    );
});

test("ProviderDiscoveryService: discovers local providers and hydrates to Dictionary", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const unscopedProviderDir = path.join(nodeModulesDir, "my-provider");
            fs.mkdirSync(unscopedProviderDir, { recursive: true });
            fs.writeFileSync(
                path.join(unscopedProviderDir, "contextjs.provider.json"),
                JSON.stringify({ name: "my-provider", templates: { foo: { commands: { bar: { description: "desc", help: "help", path: "p" } } } }, commands: { baz: { description: "desc", help: "help", path: "p" } } })
            );

            const scopedOrgDir = path.join(nodeModulesDir, "@demo");
            const scopedProviderDir = path.join(scopedOrgDir, "scoped-provider");
            fs.mkdirSync(scopedProviderDir, { recursive: true });
            fs.writeFileSync(
                path.join(scopedProviderDir, "contextjs.provider.json"),
                JSON.stringify({ name: "scoped-provider", templates: {}, commands: {} })
            );
        },

        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const providers = Array.from(ProviderDiscoveryService.discover(false)).sort((a, b) => a.name.localeCompare(b.name));

            context.assert.strictEqual(providers.length, 2);

            const provider = providers[0];
            context.assert.strictEqual(provider.name, "my-provider");
            context.assert.ok(provider.templates instanceof Dictionary);
            context.assert.ok(provider.commands instanceof Dictionary);
            context.assert.ok(provider.templates.has("foo"));
            context.assert.ok(provider.commands.has("baz"));

            const template = provider.templates.get("foo");
            context.assert.ok(template);
            context.assert.ok(template!.commands instanceof Dictionary);
            context.assert.ok(template!.commands.has("bar"));

            const commands = new Dictionary<string, ICommandManifest>();
            commands.set("bar", { description: "desc", help: "help", path: "p" });

            context.assert.deepStrictEqual(dictionaryToObject(provider.commands), { baz: { description: "desc", help: "help", path: "p" } });
            context.assert.deepStrictEqual(dictionaryToObject(provider.templates), { foo: { commands: commands } });

            context.assert.strictEqual(providers[1].name, "scoped-provider");
            context.assert.ok(providers[1].templates instanceof Dictionary);
            context.assert.strictEqual(providers[1].templates.count(), 0);
        }
    );
});

test("ProviderDiscoveryService: prefers local over global with same name", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const localProviderDir = path.join(nodeModulesDir, "test-provider");
            fs.mkdirSync(localProviderDir, { recursive: true });
            fs.writeFileSync(
                path.join(localProviderDir, "contextjs.provider.json"),
                JSON.stringify({ name: "test-provider", templates: { a: { commands: { c1: { description: "desc", help: "help", path: "p" } } } }, commands: { b: { description: "desc", help: "help", path: "p" } } })
            );

            const globalModulesDir = path.join(nodeModulesDir, "../global_modules");
            fs.mkdirSync(globalModulesDir, { recursive: true });
            const globalProviderDir = path.join(globalModulesDir, "test-provider");
            fs.mkdirSync(globalProviderDir, { recursive: true });
            fs.writeFileSync(
                path.join(globalProviderDir, "contextjs.provider.json"),
                JSON.stringify({ name: "test-provider", templates: { c: { commands: { c2: { description: "desc", help: "help", path: "p" } } } }, commands: { d: { description: "desc", help: "help", path: "p" } } })
            );
        },

        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const providers = Array.from(ProviderDiscoveryService.discover(false));
            context.assert.strictEqual(providers.length, 1);
            context.assert.strictEqual(providers[0].name, "test-provider");

            context.assert.ok(providers[0].templates.has("a"));
            context.assert.ok(!providers[0].templates.has("c"));
            context.assert.ok(providers[0].templates.get("a")!.commands.has("c1"));
            context.assert.deepStrictEqual(dictionaryToObject(providers[0].commands), {
                b: { description: "desc", help: "help", path: "p" }
            });
        }
    );
});

test("ProviderDiscoveryService: warns on invalid manifest file", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const invalidProviderDir = path.join(nodeModulesDir, "bad-provider");
            fs.mkdirSync(invalidProviderDir, { recursive: true });
            fs.writeFileSync(path.join(invalidProviderDir, "contextjs.provider.json"), "not json");
        },

        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const getWarnings = captureConsoleWarnings(context);
            const providers = Array.from(ProviderDiscoveryService.discover(false));
            context.assert.strictEqual(providers.length, 0);
            const warnings = getWarnings();
            context.assert.ok(warnings.some(w => /Invalid provider manifest/.test(w)));
        }
    );
});

test("ProviderDiscoveryService: template and command hydration with empty objects", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const providerDir = path.join(nodeModulesDir, "empty-provider");
            fs.mkdirSync(providerDir, { recursive: true });
            fs.writeFileSync(
                path.join(providerDir, "contextjs.provider.json"),
                JSON.stringify({ name: "empty-provider", templates: {}, commands: {} })
            );
        },
        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const providers = Array.from(ProviderDiscoveryService.discover(false));
            context.assert.strictEqual(providers.length, 1);
            const provider = providers[0];
            context.assert.ok(provider.templates instanceof Dictionary);
            context.assert.ok(provider.commands instanceof Dictionary);
            context.assert.strictEqual(provider.templates.count(), 0);
            context.assert.strictEqual(provider.commands.count(), 0);
        }
    );
});

test("ProviderDiscoveryService: nested template commands are hydrated to Dictionary", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const providerDir = path.join(nodeModulesDir, "provider-nested");
            fs.mkdirSync(providerDir, { recursive: true });
            fs.writeFileSync(
                path.join(providerDir, "contextjs.provider.json"),
                JSON.stringify({
                    name: "provider-nested",
                    templates: {
                        t1: {
                            commands: {
                                x: { description: "desc x", help: "help x", path: "p" },
                                y: { description: "desc y", help: "help y", path: "p2" }
                            }
                        }
                    },
                    commands: {}
                })
            );
        },
        async (nodeModulesDir) => {
            overrideCwd(context, path.dirname(nodeModulesDir));
            const providers = Array.from(ProviderDiscoveryService.discover(false));
            context.assert.strictEqual(providers.length, 1);
            const provider = providers[0];
            context.assert.ok(provider.templates.has("t1"));
            const template = provider.templates.get("t1");
            context.assert.ok(template!.commands instanceof Dictionary);
            context.assert.strictEqual(template!.commands.count(), 2);
            context.assert.ok(template!.commands.has("x"));
            context.assert.ok(template!.commands.has("y"));
        }
    );
});

test("ProviderDiscoveryService: hydrates extensions from local provider", async (context: TestContext) => {
    await withIsolatedNodeModulesAsync(
        async (nodeModulesDir) => {
            const providerDir = path.join(nodeModulesDir, "with-extensions");
            fs.mkdirSync(providerDir, { recursive: true });
            fs.writeFileSync(
                path.join(providerDir, "contextjs.provider.json"),
                JSON.stringify({
                    name: "with-extensions",
                    templates: {},
                    commands: {},
                    extensions: { before: ["a.js", "b.js"], after: ["c.js"] }
                })
            );
        },
        async (nodeModulesDir) => {
            const providerDir = path.join(nodeModulesDir, "with-transformers");
            fs.mkdirSync(providerDir, { recursive: true });
            fs.writeFileSync(
                path.join(providerDir, "contextjs.provider.json"),
                JSON.stringify({
                    name: "with-transformers",
                    templates: {},
                    commands: {},
                    transformers: { before: ["a.js", "b.js"], after: ["c.js"] }
                })
            );
        }
    );
});