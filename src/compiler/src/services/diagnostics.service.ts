/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import typescript from "typescript";

export class DiagnosticsService {
    public static formatTypescriptDiagnostics(diagnostics: typescript.Diagnostic[]): string[] {
        return diagnostics.map(diagnostic => {
            const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

            if (diagnostic.file) {
                const location = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
                const fileName = diagnostic.file.fileName;
                const line = location.line + 1;
                const char = location.character + 1;

                return `Error at ${fileName}(${line},${char}): ${message}`;
            }

            return `Error: ${message}`;
        });
    }
}