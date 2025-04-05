/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Location } from "../sources/location.js";
import { DiagnosticSeverity } from "./diagnostic-severity.js";

export class Diagnostic {
    public readonly severity: DiagnosticSeverity;
    public readonly location: Location | null;
    public readonly message: string;

    public constructor(severity: DiagnosticSeverity, message: string, location: Location | null = null) {
        this.severity = severity;
        this.location = location;
        this.message = message;
    }

    public static info(message: string, location: Location | null = null): Diagnostic {
        return new Diagnostic(DiagnosticSeverity.Info, message, location);
    }

    public static warning(message: string, location: Location | null = null): Diagnostic {
        return new Diagnostic(DiagnosticSeverity.Warning, message, location);
    }

    public static error(message: string, location: Location | null = null): Diagnostic {
        return new Diagnostic(DiagnosticSeverity.Error, message, location);
    }

    public toString(): string {
        return this.location
            ? `[${this.severity}] ${this.message} [${this.location}]`
            : `[${this.severity}] ${this.message}`;
    }
}