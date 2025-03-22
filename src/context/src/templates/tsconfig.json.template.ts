/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { FileTemplate } from "../models/file-template.js";

export class TsConfigTemplate {
    private static readonly name = "tsconfig.json";
    private static readonly content = `{
    "compilerOptions": {
        "outDir": "_build",
        "target": "ESNext",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "sourceMap": false,
        "inlineSourceMap": true,
        "allowSyntheticDefaultImports": true,
        "declaration": false,
        "isolatedModules": true,
        "esModuleInterop": true,
        "strictNullChecks": true,
        "noImplicitReturns": true,
        "noImplicitAny": true,
        "noImplicitOverride": true,
        "noImplicitThis": true,
        "noPropertyAccessFromIndexSignature": true,
        "noErrorTruncation": true,
        "noEmitOnError": true,
        "strictBindCallApply": true,
        "strictFunctionTypes": true,
        "alwaysStrict": true,
        "strictPropertyInitialization": true,
        "noFallthroughCasesInSwitch": true,
        "strict": true,
        "resolveJsonModule": true,
        "skipLibCheck": false,
        "forceConsistentCasingInFileNames": true,
        "removeComments": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}`;

    public static readonly template: FileTemplate = {
        name: TsConfigTemplate.name,
        content: TsConfigTemplate.content
    };
}