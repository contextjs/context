/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Compiler } from "@contextjs/compiler";
import { File } from "@contextjs/io";
import { Console, StringExtensions } from "@contextjs/system";
import test, { TestContext } from "node:test";
import typescript from "typescript";
import { CommandType } from "../../../src/models/command-type.ts";
import { Command } from "../../../src/models/command.ts";
import { Project } from "../../../src/models/project.ts";
import { WatchCommand } from "../../../src/services/commands/watch.command.ts";

test("WatchCommand: runAsync - no projects", async (context: TestContext) => {
    let output = StringExtensions.empty;
    const originalOutput = Console["output"];
    const originalExit = process.exit;

    Console.setOutput((...args: any[]) => { output += args.map(arg => String(arg)).join(" ") + "\n"; });
    process.exit = (code: number) => { throw new Error(`exit:${code}`); };

    const command = new Command(CommandType.Watch, [{ name: "project", values: ["none"] }]);
    const watchCommand = new WatchCommand();
    context.mock.method(watchCommand as any, "getProjects", () => []);

    let threw: Error | null = null;
    try {
        await watchCommand.runAsync(command);
    }
    catch (error) {
        threw = error as Error;
    }

    context.assert.ok(threw);
    context.assert.match(threw.message, /exit:1/);
    context.assert.match(output, /No projects found\. Exiting/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});

test("WatchCommand: runAsync - success", async (context: TestContext) => {
    const originalOutput = Console["output"];
    const originalExit = process.exit;

    Console.setOutput(() => { });
    process.exit = (code: number) => { throw new Error(`exit:${code}`); };

    const command = new Command(CommandType.Watch, []);
    const watchCommand = new WatchCommand();
    const projects: Project[] = [new Project("test", "test")];

    context.mock.method(watchCommand as any, "getProjects", () => projects);
    context.mock.method(File, "exists", () => true);
    context.mock.method(File, "read", () => JSON.stringify({}));

    context.mock.method(typescript.sys, "fileExists", () => true);
    context.mock.method(typescript.sys, "readFile", (_path: any) => JSON.stringify({
        compilerOptions: { rootDir: "src", outDir: "_build" },
        include: ["src/**/*.ts", "src/.context/**/*.ts"]
    }));
    context.mock.method(typescript.sys, "readDirectory", () => []);
    context.mock.method(typescript.sys, "getCurrentDirectory", () => process.cwd());
    (typescript.sys as any).useCaseSensitiveFileNames = () => true;

    let called = false;
    context.mock.method(Compiler, "watch", () => { called = true; });

    await watchCommand.runAsync(command);

    context.assert.strictEqual(called, true);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});