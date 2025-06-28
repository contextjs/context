import { Diagnostic as ParserDiagnostic, DiagnosticSeverity as ParserDiagnosticSeverity } from "@contextjs/views";
import { ObjectExtensions } from "@contextjs/system";
import { Diagnostic, DiagnosticSeverity, PublishDiagnosticsParams } from "vscode-languageserver/node.js";
import { ServerContext } from "../server-context.js";

export class DiagnosticsService {
    public constructor(private readonly context: ServerContext) { }

    public analyse(): PublishDiagnosticsParams | null {
        if (ObjectExtensions.isNullOrUndefined(this.context.document) ||
            ObjectExtensions.isNullOrUndefined(this.context.parserResult) ||
            this.context.parserResult.diagnostics.length === 0)
            return null;

        return this.convertDiagnostics(this.context.document.uri, this.context.parserResult.diagnostics);
    }

    private convertDiagnostics(uri: string, diagnostics: ParserDiagnostic[]): PublishDiagnosticsParams {
        if (ObjectExtensions.isNullOrUndefined(diagnostics) || diagnostics.length === 0)
            return { uri, diagnostics: [] };

        return { uri, diagnostics: diagnostics.map(diagnostic => this.toDiagnostic(uri, diagnostic)) };
    }

    private toDiagnostic(uri: string, diagnostic: ParserDiagnostic): Diagnostic {
        return {
            message: diagnostic.toString(),
            range: {
                start: {
                    line: diagnostic.location?.startLineIndex ?? 0,
                    character: diagnostic.location?.startCharacterIndex ?? 0
                },
                end: {
                    line: diagnostic.location?.endLineIndex ?? 0,
                    character: diagnostic.location?.endCharacterIndex ?? 0
                }
            },
            severity: this.toDiagnosticSeverity(diagnostic),
            source: uri
        };
    }

    private toDiagnosticSeverity(diagnostic: ParserDiagnostic): DiagnosticSeverity {
        switch (diagnostic.severity) {
            case ParserDiagnosticSeverity.Error:
                return DiagnosticSeverity.Error;
            case ParserDiagnosticSeverity.Warning:
                return DiagnosticSeverity.Warning;
            case ParserDiagnosticSeverity.Info:
                return DiagnosticSeverity.Information;
            default:
                return DiagnosticSeverity.Error;
        }
    }
}