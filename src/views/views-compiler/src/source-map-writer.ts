import { SourceMapGenerator } from "source-map";
import type { ISourceMapWriter } from "./interfaces/i-source-map-writer.js";

export class SourceMapWriter implements ISourceMapWriter {
    private generator: SourceMapGenerator;

    constructor(file: string) {
        this.generator = new SourceMapGenerator({ file });
    }

    addMapping(params: {
        generated: { line: number; column: number };
        original: { line: number; column: number };
        source: string;
        name?: string;
    }): void {
        this.generator.addMapping({
            generated: { line: params.generated.line, column: params.generated.column },
            original: { line: params.original.line, column: params.original.column },
            source: params.source,
            name: params.name,
        });
    }

    setSourceContent(sourceFile: string, content: string): void {
        this.generator.setSourceContent(sourceFile, content);
    }

    toString(): string {
        return this.generator.toString();
    }
}
