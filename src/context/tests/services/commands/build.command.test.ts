/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Directory, File } from "@contextjs/io";
import { Console } from "@contextjs/system";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test, { TestContext } from "node:test";
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { BuildCommand } from "../../../src/services/commands/build.command.ts";

async function withTempDirAsync<T>(action: (dir: string) => Promise<T> | T): Promise<T> {
    const tempRoot = os.tmpdir();
    const tempDir = fs.mkdtempSync(path.join(tempRoot, "ctxtest-"));
    let result: T | undefined;
    try {
        result = await action(tempDir);
        return result;
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

const mockProcessExit = (context: TestContext) => {
    const originalExit = process.exit;
    let exitCode = -1;

    process.exit = (code: number) => {
        exitCode = code;
        throw new Error(`exit:${code}`);
    };

    context.after(() => {
        process.exit = originalExit;
    });

    return () => exitCode;
};

const mockConsoleOutput = (context: TestContext) => {
    const originalOutput = Console["output"];
    let output = "";

    Console.setOutput((...args: any[]) => {
        output += args.map(String).join(" ") + "\n";
    });

    context.after(() => {
        Console.setOutput(originalOutput);
    });

    return () => output;
};

test("BuildCommand: runAsync(--project) - no projects", async (context: TestContext) => {
    mockProcessExit(context);
    const getOutput = mockConsoleOutput(context);
    const command = new Command(CommandType.Build, []);
    const buildCommand = new BuildCommand();

    context.mock.method(buildCommand as any, "getProjects", () => []);

    let threw: Error | null = null;
    try {
        await buildCommand.runAsync(command);
    }
    catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(getOutput(), /No projects found\. Exiting/);
});

test("BuildCommand: runAsync - project build success", async (context: TestContext) => {
    const command = new Command(CommandType.Build, [{ name: "project", values: ["any"] }]);
    const buildCommand = new BuildCommand();
    const projects = [new Project("project1", "path1")];

    context.mock.method(buildCommand as any, "getProjects", () => projects);
    context.mock.method(buildCommand as any, "buildAsync", () => void 0);
    context.assert.doesNotThrow(() => buildCommand.runAsync(command));
});

test("BuildCommand: buildAsync - throws if context.ctxp missing", async (context: TestContext) => {
    await withTempDirAsync(async (tempDir) => {
        mockProcessExit(context);
        const getOutput = mockConsoleOutput(context);
        const project = new Project("missing-ctxp", tempDir);
        Directory.create(project.path);

        const buildCommand = new BuildCommand();
        let threw: Error | null = null;
        try {
            await (buildCommand as any).buildAsync(project);
        }
        catch (error) {
            threw = error as Error;
        }

        context.assert.ok(threw);
        context.assert.match(threw.message, /exit:1/);
        context.assert.match(getOutput(), /No context file found\. Exiting/);
    });
});

test("BuildCommand: buildAsync - throws if tsconfig.json missing", async (context: TestContext) => {
    await withTempDirAsync(async (tempDir) => {
        mockProcessExit(context);
        const getOutput = mockConsoleOutput(context);
        const project = new Project("missing-tsconfig", tempDir);
        Directory.create(project.path);
        File.save(path.join(project.path, "context.ctxp"), "{}", true);

        const buildCommand = new BuildCommand();
        let threw: Error | null = null;
        try {
            await (buildCommand as any).buildAsync(project);
        }
        catch (error) {
            threw = error as Error;
        }

        context.assert.ok(threw);
        context.assert.match(threw.message, /exit:1/);
        context.assert.match(getOutput(), /No tsconfig\.json file found\. Exiting/);
    });
});

test("BuildCommand: compileAsync - emits valid project", async (context: TestContext) => {
    await withTempDirAsync(async (base) => {
        const srcDir = path.join(base, "src");

        Directory.create(srcDir);

        const tsconfig = {
            compilerOptions: {
                outDir: "dist",
                module: "esnext",
                target: "esnext",
                moduleResolution: "node",
                rootDir: "src",
                declaration: false,
                noEmitOnError: false,
                strict: true
            },
            include: ["src"]
        };

        File.save(path.join(base, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));
        File.save(path.join(base, "context.ctxp"), "{}");
        File.save(path.join(srcDir, "index.ts"), "export const hello = 'world';");

        const project = new Project("compile-test", base);
        const buildCommand = new BuildCommand();

        let threw: Error | null = null;
        const originalExit = process.exit;
        process.exit = () => { throw new Error("exit"); };

        try {
            await (buildCommand as any).compileAsync(project);
        }
        catch (error) {
            threw = error as Error;
        }
        finally {
            process.exit = originalExit;
        }

        context.assert.strictEqual(threw, null);
        context.assert.ok(File.exists(path.join(base, "dist", "index.js")));
    });
});

test("BuildCommand: copyFiles - success", (context: TestContext) => {
    context.mock.method(File, "read", () => JSON.stringify({ files: [{ from: "from1", to: "to1" }] }));
    context.mock.method(File, "exists", () => true);
    context.mock.method(File, "copy", () => true);
    const project = new Project("test", "dir");
    const buildCommand = new BuildCommand();

    context.assert.doesNotThrow(() => (buildCommand as any).copyFiles(project, {}));
});