import typescript from "typescript";
export class TransformersService {
    public transformers: Array<typescript.TransformerFactory<typescript.SourceFile>> = [];
    public constructor(private readonly program: typescript.Program) {}
}