/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { DiagnosticMessage, DiagnosticSeverity, Location, Diagnostic as ParserDiagnostic } from "@contextjs/views";

export class Diagnostic {
    private readonly parserDiagnostic: ParserDiagnostic;
    public readonly filePath: string;

    public get severity(): DiagnosticSeverity {
        return this.parserDiagnostic.severity;
    }

    public get message(): DiagnosticMessage {
        return this.parserDiagnostic.message;
    }

    public get location(): Location | null {
        return this.parserDiagnostic.location;
    }

    public constructor(parserDiagnostic: ParserDiagnostic, filePath: string) {
        this.parserDiagnostic = parserDiagnostic;
        this.filePath = filePath;
    }

    public static info(message: DiagnosticMessage, filePath: string, location: Location | null = null): Diagnostic {
        const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Info, message, location);
        return new Diagnostic(parserDiagnostic, filePath);
    }

    public static warning(message: DiagnosticMessage, filePath: string, location: Location | null = null): Diagnostic {
        const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Warning, message, location);
        return new Diagnostic(parserDiagnostic, filePath);
    }

    public static error(message: DiagnosticMessage, filePath: string, location: Location | null = null): Diagnostic {
        const parserDiagnostic = new ParserDiagnostic(DiagnosticSeverity.Error, message, location);
        return new Diagnostic(parserDiagnostic, filePath);
    }

    public toString(): string {
        return this.parserDiagnostic.location
            ? `[${this.filePath}] [${this.parserDiagnostic.severity}] ${this.parserDiagnostic.message.code}: ${this.parserDiagnostic.message.message} [${this.parserDiagnostic.location}]`
            : `[${this.filePath}] [${this.parserDiagnostic.severity}] ${this.parserDiagnostic.message.code}: ${this.parserDiagnostic.message.message}`;
    }
}