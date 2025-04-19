/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, StringExtensions } from "@contextjs/system";
import test, { TestContext } from "node:test";
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
    let output = StringExtensions.empty;
    const originalOutput = Console["output"];
    const originalExit = process.exit;

    Console.setOutput((...args: any[]) => { output += args.map(arg => String(arg)).join(" ") + "\n"; });

    process.exit = (code: number) => { throw new Error(`exit:${code}`); };

    const command = new Command(CommandType.Watch, []);
    const watchCommand = new WatchCommand();
    const projects: Project[] = [new Project("test", "test")];

    context.mock.method(watchCommand as any, "getProjects", () => projects);

    const { Compiler } = await import("@contextjs/compiler");
    context.mock.method(Compiler, "watch", () => { });

    await watchCommand.runAsync(command);

    context.assert.match(output, /Watching project "test" for changes/);

    Console.setOutput(originalOutput);
    process.exit = originalExit;
});