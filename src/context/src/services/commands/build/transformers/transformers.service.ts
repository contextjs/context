import ts from "typescript";

export class TransformersService {
    public static transformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    ];
}