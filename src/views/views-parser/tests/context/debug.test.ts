/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { Debug } from "../../src/context/debug.js";
import { ParserContext } from "../../src/context/parser-context.js";

function createContext(debugMode: boolean): ParserContext {
    return { debugMode, } as unknown as ParserContext;
}

test("Debug: log() writes line only if debugMode=true", (context: TestContext) => {
    let captured = "";
    const origWriteLine = Console.writeLine;
    Console.writeLine = (msg: string) => { captured = msg; };

    const parserContext = createContext(true);
    const debug = new Debug(parserContext);

    debug.log("Hello debug");
    context.assert.strictEqual(captured, "Hello debug");

    captured = "";
    (parserContext as any).debugMode = false;
    debug.log("Should not show");
    context.assert.strictEqual(captured, "");

    Console.writeLine = origWriteLine;
});

test("Debug: error() writes error only if debugMode=true", (context: TestContext) => {
    let captured = "";
    const origWriteLineError = Console.writeLineError;
    Console.writeLineError = (msg: string) => { captured = msg; };

    const parserContext = createContext(true);
    const debug = new Debug(parserContext);

    debug.error("This is an error!");
    context.assert.strictEqual(captured, "This is an error!");

    captured = "";
    (parserContext as any).debugMode = false;
    debug.error("Should not error");
    context.assert.strictEqual(captured, "");

    Console.writeLineError = origWriteLineError;
});

test("Debug: warn() writes warning only if debugMode=true", (context: TestContext) => {
    let captured = "";
    const origWriteLineWarning = Console.writeLineWarning;
    Console.writeLineWarning = (msg: string) => { captured = msg; };

    const parserContext = createContext(true);
    const debug = new Debug(parserContext);

    debug.warn("Warn message");
    context.assert.strictEqual(captured, "Warn message");

    captured = "";
    (parserContext as any).debugMode = false;
    debug.warn("Should not warn");
    context.assert.strictEqual(captured, "");

    Console.writeLineWarning = origWriteLineWarning;
});

test("Debug: throw() throws only if debugMode=true", (context: TestContext) => {
    const parserContext = createContext(true);
    const debug = new Debug(parserContext);

    context.assert.throws(() => debug.throw("My error"), { message: "My error" });

    (parserContext as any).debugMode = false;
    debug.throw("Should not throw");

    context.assert.ok(true);
});

test("Debug: constructor assigns context property", (context: TestContext) => {
    const parserContext = createContext(true);
    const debug = new Debug(parserContext);
    
    context.assert.strictEqual((debug as any).context, parserContext);
});