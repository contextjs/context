import { ConsoleService, VersionService } from "@contextjs/system";
import { Command } from "../../models/command.js";
import { CommandBase } from "./command-base.js";

export class CtxCommand extends CommandBase {
    private readonly text = `Usage: ctx [options]

Options:
    new     creates a new project or solution
`;

    public override async runAsync(command: Command): Promise<void> {
        VersionService.display();
        ConsoleService.writeLine(this.text);
    }
}