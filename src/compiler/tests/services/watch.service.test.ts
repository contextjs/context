import { Directory, File } from "@contextjs/io";
import os from "node:os";
import path from "node:path";
import test, { TestContext } from "node:test";
import typescript from "typescript";
import { WatchService } from "../../src/services/watch.service.js";

test("WatchService: execute triggers onDiagnostic from real compiler host", async (context: TestContext) => {
    const tempDir = path.join(os.tmpdir(), `ctx-watch-${Date.now()}`);
    Directory.create(tempDir);

    // Cleanup temp dir after test
    context.after(() => {
        Directory.delete(tempDir);
    });

    File.save(path.join(tempDir, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
            target: "esnext",
            module: "esnext",
            rootDir: "./",
            outDir: "dist",
            strict: true
        },
        include: ["index.ts"]
    }, null, 2));

    File.save(path.join(tempDir, "index.ts"), `const x: string = 123;`);

    const diagnostics: typescript.Diagnostic[] = [];

    const extensionsModule = await import("../../src/services/extensions.service.js");
    const transformersModule = await import("../../src/services/transformers.service.js");

    const originalExtensions = extensionsModule.ExtensionsService.getTransformers;
    const originalTransformers = transformersModule.TransformersService.merge;

    extensionsModule.ExtensionsService.getTransformers = () => ({ before: null, after: null });
    transformersModule.TransformersService.merge = () => ({ before: undefined, after: undefined });

    context.after(() => {
        extensionsModule.ExtensionsService.getTransformers = originalExtensions;
        transformersModule.TransformersService.merge = originalTransformers;
    });

    const watcher = WatchService.execute(tempDir, {
        onDiagnostic: diagnostic => diagnostics.push(diagnostic)
    });

    await new Promise<void>((resolve) => {
        setTimeout(() => {
            watcher.close();

            if (!diagnostics.length)
                throw new Error("No diagnostics received");

            resolve();
        }, 1000);
    });
});