/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { Console } from '@contextjs/system';
import fs from "node:fs";
import typescript from "typescript";
import { Command } from "../../models/command.js";
import { Project } from '../../models/project.js';
import { TemplatesService } from "../templates/templates.service.js";

export abstract class CommandBase {
    public abstract runAsync(command: Command): Promise<void>;

    protected async tryDisplayHelpAsync(command: Command, templatesService: TemplatesService): Promise<boolean> {
        const helpCommandName = command.args[1]?.name;
        if (helpCommandName === '-h' || helpCommandName === '--help') {
            await templatesService.displayHelpAsync();
            return true;
        }

        return false;
    }

    protected getProjects(projectNames: string[]): Project[] {
        let directoryEntries = fs.readdirSync(process.cwd(), { withFileTypes: true, encoding: 'utf-8', recursive: true });
        let projects: Project[] = [];

        directoryEntries.forEach(entry => {
            if (entry.isFile() && entry.name === 'context.ctxp') {
                const entryPath = entry.parentPath;
                const projectFile = File.read(`${entryPath}/context.ctxp`);
                const projectName = JSON.parse(projectFile || '{}')?.name || '';

                if (projectNames.length > 0 && !projectNames.includes(projectName))
                    return;

                projects.push(new Project(projectName, entryPath));
            }
        });

        return projects;
    }

    protected processDiagnostics(projectDescriptor: Project, diagnostics: typescript.Diagnostic[] | readonly typescript.Diagnostic[]): void {
        diagnostics.forEach(diagnostic => {
            let message = '';
            if (diagnostic.file) {
                const { line, character } = typescript.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
                message = `${projectDescriptor.name}: ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
            }
            else
                message = `${projectDescriptor.name}: ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;

            if (diagnostic.category === typescript.DiagnosticCategory.Error)
                Console.writeLineError(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Warning)
                Console.writeLineWarning(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Message)
                Console.writeLine(message);
        });
    }
}