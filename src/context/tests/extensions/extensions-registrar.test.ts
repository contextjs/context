/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { Directory, File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import os from "os";
import path from "path";
import { ExtensionsRegistrar } from "../../src/extensions/extensions-registrar.js";

function createTempDir(subdir: string): string {
    const dir = path.join(os.tmpdir(), `ctx-transformers-${subdir}-${Date.now()}`);
    Directory.create(dir);
    return dir;
}

test("ExtensionsRegistrar: registerAsync() loads valid transformers", async (context: TestContext) => {
    const tempDir = createTempDir("valid");
    context.after(() => Directory.delete(tempDir));

    File.save(path.join(tempDir, "valid-transformer.js"), `
        export default {
            name: 'test-transformer',
            getTransformers: () => ({ before: null, after: null })
        };
    `);

    const registered: string[] = [];
    const originalRegister = Compiler.registerExtension;
    Compiler.registerExtension = (ext) => registered.push(ext.name);

    (ExtensionsRegistrar as any).registered = false;
    const registrar = new ExtensionsRegistrar(tempDir);
    await registrar.registerAsync();

    context.assert.deepEqual(registered, ["test-transformer"]);
    Compiler.registerExtension = originalRegister;
});

test("ExtensionsRegistrar: skips files that do not export valid extensions", async (context: TestContext) => {
    const tempDir = createTempDir("invalid");
    context.after(() => Directory.delete(tempDir));

    File.save(path.join(tempDir, "invalid.js"), `export default {}`); // no name/getTransformers

    const registered: string[] = [];
    const originalRegister = Compiler.registerExtension;
    Compiler.registerExtension = (ext) => registered.push(ext.name);

    (ExtensionsRegistrar as any).registered = false;
    const registrar = new ExtensionsRegistrar(tempDir);
    await registrar.registerAsync();

    context.assert.strictEqual(registered.length, 0);
    Compiler.registerExtension = originalRegister;
});

test("ExtensionsRegistrar: handles import errors gracefully", async (context: TestContext) => {
    const tempDir = createTempDir("broken");
    context.after(() => Directory.delete(tempDir));

    File.save(path.join(tempDir, "broken.js"), `throw new Error("broken")`);

    let errorLogged = false;
    const originalError = Console.writeLineError;
    Console.writeLineError = (text: string) => {
        if (text.includes("Failed to load transformer"))
            errorLogged = true;
    };

    (ExtensionsRegistrar as any).registered = false;
    const registrar = new ExtensionsRegistrar(tempDir);
    await registrar.registerAsync();

    context.assert.ok(errorLogged);
    Console.writeLineError = originalError;
});

test("ExtensionsRegistrar: loads files in sorted order", async (context: TestContext) => {
    const tempDir = createTempDir("sorted");
    context.after(() => Directory.delete(tempDir));

    File.save(path.join(tempDir, "b-transformer.js"), `
        export default {
            name: 'B',
            getTransformers: () => ({ before: null, after: null })
        };
    `);
    File.save(path.join(tempDir, "a-transformer.js"), `
        export default {
            name: 'A',
            getTransformers: () => ({ before: null, after: null })
        };
    `);

    const registered: string[] = [];
    const originalRegister = Compiler.registerExtension;
    Compiler.registerExtension = (ext) => registered.push(ext.name);

    (ExtensionsRegistrar as any).registered = false;
    const registrar = new ExtensionsRegistrar(tempDir);
    await registrar.registerAsync();

    context.assert.deepEqual(registered, ["A", "B"]);
    Compiler.registerExtension = originalRegister;
});
