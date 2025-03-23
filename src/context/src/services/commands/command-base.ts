/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import fs from "node:fs";
import typescript from "typescript";
import { Command } from "../../models/command.js";
import { Project } from '../../models/project.js';
import { File } from '@contextjs/io'

export abstract class CommandBase {
    public abstract runAsync(command: Command): Promise<void>;

    protected getProjectDescriptors(projectNames: string[]): Project[] {
        let directoryEntries = fs.readdirSync(process.cwd(), { withFileTypes: true, encoding: 'utf-8', recursive: true });
        let projects: Project[] = [];

        directoryEntries.forEach(entry => {
            if (entry.isFile() && entry.name === 'context.json') {
                const entryPath = entry.parentPath || entry.path;
                const projectFile = File.read(`${entryPath}/context.json`);
                const projectName = JSON.parse(projectFile || '{}')?.name || '';

                if (projectNames.length > 0 && !projectNames.includes(projectName))
                    return;

                projects.push(new Project(projectName, entry.parentPath || entry.path));
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
                console.error(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Warning)
                console.warn(message);
            else if (diagnostic.category === typescript.DiagnosticCategory.Message)
                console.log(message);
        });
    }
}