/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Dictionary } from "@contextjs/collections";
import { Console, ConsoleMessage } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { HelpService } from "../src/services/help.service.js";
import { ProviderDiscoveryService } from "../src/services/provider-discovery.service.js";

function mockConsoleOutput(context: TestContext) {
    let output = "";
    let info = "";
    let warning = "";
    let formatted = "";
    Console.writeLine = (msg: string) => { output += msg + "\n"; };
    Console.writeLineInfo = (msg: string) => { info += msg + "\n"; };
    Console.writeLineWarning = (msg: string) => { warning += msg + "\n"; };
    Console.writeLineFormatted = (message: ConsoleMessage, ...messages: ConsoleMessage[]) => {formatted += message.text + messages.map(m => m.text).join(""); };

    const restore = {
        writeLine: Console.writeLine,
        writeLineInfo: Console.writeLineInfo,
        writeLineWarning: Console.writeLineWarning,
        writeLineFormatted: Console.writeLineFormatted
    };

    context.after(() => {
        Console.writeLine = restore.writeLine;
        Console.writeLineInfo = restore.writeLineInfo;
        Console.writeLineWarning = restore.writeLineWarning;
        Console.writeLineFormatted = restore.writeLineFormatted;
    });

    return () => ({ output, info, warning, formatted });
}

test("HelpService: shows warning when no providers found", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [] } as any);

    const { warning } = getConsoleOutput();
    context.assert.match(warning, /No providers found/i);
});

test("HelpService: shows warning when no templates or commands found", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);
    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [{compilerExtensions: [], name: "p", root: "/", templates: new Dictionary(), commands: new Dictionary() }];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [] } as any);

    const { warning, output } = getConsoleOutput();
    context.assert.match(warning, /Templates: none\./);
    context.assert.match(warning, /Commands: none\./);
    context.assert.strictEqual(output, "");
});

test("HelpService: lists available templates and commands", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const demoProvider = {
        name: "demo",
        root: "/",
        templates: new Map([
            ["tmpl", {
                title: "Demo Template",
                path: "",
                description: "A demo template.",
                commands: new Map([
                    ["cmd", { description: "A template command", help: "Help for template command", path: "" }]
                ])
            }]
        ]),
        commands: new Map([
            ["rootcmd", { description: "A root command", help: "Help for root command", path: "" }]
        ])
    };

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [demoProvider as any];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [] } as any);

    const { output, info, warning, formatted } = getConsoleOutput();

    context.assert.match(output, /Templates:/);
    context.assert.match(formatted, /  tmpl- A demo template.  cmd- A template command/);
    context.assert.match(output, /Commands:/);
    context.assert.match(formatted, /rootcmd- A root command/);
    context.assert.match(warning, /Type 'ctx --help <template\|command>'/);
});

test("HelpService: shows detailed help for a specific template", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const demoProvider = {
        name: "demo",
        root: "/",
        templates: new Map([
            ["tmpl", {
                title: "Demo Template",
                path: "",
                description: "Template description.",
                commands: new Map([
                    ["cmd", { description: "Template Command", help: "Help for cmd", path: "" }]
                ])
            }]
        ]),
        commands: new Map()
    };

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [demoProvider as any];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [{ values: ["tmpl"] }] } as any);

    const { output, info, formatted } = getConsoleOutput();

    context.assert.strictEqual(formatted, "Template: tmpl(Demo Template)    cmd- Template Command");
    context.assert.match(output, /Commands:/);
});

test("HelpService: shows detailed help for a provider/root command", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const demoProvider = {
        name: "demo",
        root: "/",
        templates: new Map(),
        commands: new Map([
            ["mycmd", { description: "Root command", help: "Root help", path: "" }]
        ])
    };

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [demoProvider as any];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [{ values: ["mycmd"] }] } as any);

    const { info, output } = getConsoleOutput();
    context.assert.match(info, /Command: mycmd/);
    context.assert.match(output, /Root command/);
    context.assert.match(output, /Root help/);
});

test("HelpService: shows detailed help for a template command", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const demoProvider = {
        name: "demo",
        root: "/",
        templates: new Map([
            ["tmpl", {
                title: "Tmpl",
                path: "",
                description: "desc",
                commands: new Map([
                    ["cmd", { description: "A command", help: "cmd help", path: "" }]
                ])
            }]
        ]),
        commands: new Map()
    };

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [demoProvider as any];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [{ values: ["cmd"] }] } as any);

    const { info, output } = getConsoleOutput();
    context.assert.match(info, /Command: cmd \(tmpl\)/);
    context.assert.match(output, /A command/);
    context.assert.match(output, /cmd help/);
});

test("HelpService: falls back to default help if argument does not match", (context: TestContext) => {
    const getConsoleOutput = mockConsoleOutput(context);

    const demoProvider = {
        name: "demo",
        root: "/",
        templates: new Map([
            ["other", {
                title: "Other",
                path: "",
                description: "desc",
                commands: new Map()
            }]
        ]),
        commands: new Map()
    };

    const originalDiscover = ProviderDiscoveryService.discover;
    ProviderDiscoveryService.discover = () => [demoProvider as any];
    context.after(() => { ProviderDiscoveryService.discover = originalDiscover; });

    HelpService.display({ parsedArguments: [{ values: ["doesnotexist"] }] } as any);

    const { output, warning, info, formatted } = getConsoleOutput();
    context.assert.match(output, /Templates:/);
    context.assert.match(formatted, /  other- desc/);
    context.assert.match(warning, /Commands: none\./);
    context.assert.ok(!/Templates: none\./.test(warning));
});