import { serviceResolverTransformer } from "./service-resolver.transformer.js";
import { serviceCollectionTransformer } from "./service-collection.transformer.js";
import typescript from "typescript";
export class TransformersService {
    public transformers: Array<typescript.TransformerFactory<typescript.SourceFile>> = [serviceResolverTransformer];
    public constructor(private readonly program: typescript.Program) { this.transformers.push(serviceCollectionTransformer({
        addTransient: "transient",
        addSingleton: "singleton"
    }, program)); }
}
