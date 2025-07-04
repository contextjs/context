/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { CommandContextService } from "../src/services/command-context.service.js";

test("CommandContextService: create returns parsedArguments from Console.parseArguments", async (context: TestContext) => {
    const originalArgv = process.argv;
    const originalParse = Console.parseArguments;
    let receivedArgs: any[] = [];
    Console.parseArguments = (args: any[]) => { receivedArgs = args; return [{ name: "test", values: ["foo"] }]; };

    process.argv = ["node", "file.js", "mycmd", "--flag", "value"];

    const ctx = await CommandContextService.create();

    context.assert.deepStrictEqual(receivedArgs, ["mycmd", "--flag", "value"]);
    context.assert.deepStrictEqual(ctx, {compilerExtensions: [], parsedArguments: [{ name: "test", values: ["foo"] }] });

    Console.parseArguments = originalParse;
    process.argv = originalArgv;
});

test("CommandContextService: create handles empty argv", async (context: TestContext) => {
    const originalArgv = process.argv;
    const originalParse = Console.parseArguments;

    Console.parseArguments = (args: any[]) => { return []; };
    process.argv = ["node", "file.js"];

    const ctx = await CommandContextService.create();

    context.assert.deepStrictEqual(ctx, {compilerExtensions: [], parsedArguments: [] });

    Console.parseArguments = originalParse;
    process.argv = originalArgv;
});

test("CommandContextService: create passes all arguments after the first two", async (context: TestContext) => {
    const originalArgv = process.argv;
    const originalParse = Console.parseArguments;

    let argsReceived: any;
    Console.parseArguments = (args: any[]) => { argsReceived = args; return []; };
    process.argv = ["node", "file.js", "foo", "bar", "baz"];

    await CommandContextService.create();
    
    context.assert.deepStrictEqual(argsReceived, ["foo", "bar", "baz"]);

    Console.parseArguments = originalParse;
    process.argv = originalArgv;
});