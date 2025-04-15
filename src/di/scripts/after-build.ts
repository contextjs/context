/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import Script from '../../../scripts/script.ts';

export class AfterBuild extends Script {
    private readonly contextTransformersPath = 'src/context/src/services/commands/build/transformers';
    private readonly transformersServiceTemplate = `import typescript from "typescript";
export class TransformersService {
    public transformers: Array<typescript.TransformerFactory<typescript.SourceFile>> = [];
    public constructor(private readonly program: typescript.Program) {}
}`

    public override async runAsync(): Promise<void> {
        this.removeDirectoryAsync(this.contextTransformersPath);
        this.createDirectoryAsync(this.contextTransformersPath);
        this.writeFileAsync(`${this.contextTransformersPath}/transformers.service.ts`, this.transformersServiceTemplate);
    }
}

await new AfterBuild().runAsync();