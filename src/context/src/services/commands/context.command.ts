import { ConsoleService, StringExtensions } from "@contextjs/core";
import { Command } from "../../models/command.js";
import { CommandBase } from "./command-base.js";

export class ContextCommand extends CommandBase {

    private readonly text = `ContextJS:
Usage: ctx [options]

Options:
    new         creates a new project or solution
`;

    public override async runAsync(command: Command): Promise<void> {
        ConsoleService.write(this.text);
    }
}