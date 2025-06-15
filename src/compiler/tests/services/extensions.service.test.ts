/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import typescript from "typescript";
import { ICompilerExtension } from "../../src/interfaces/i-compiler-extension.js";
import { ExtensionsService } from "../../src/services/extensions.service.js";

test("ExtensionsService: register + getTransformers - with before/after", (context: TestContext) => {
    let beforeCalled = false;
    let afterCalled = false;

    const mockExtension: ICompilerExtension = {
        name: "mock",
        getTransformers: (_program: typescript.Program) => ({
            before: [() => {
                return (sourceFile => {
                    beforeCalled = true;
                    return sourceFile;
                });
            }],
            after: [() => {
                return (sourceFile => {
                    afterCalled = true;
                    return sourceFile;
                });
            }]
        })
    };

    (ExtensionsService as any).extensions.length = 0;
    ExtensionsService.register(mockExtension);

    const testProgram = typescript.createProgram(["tests/stubs/project/src/example.ts"], {
        module: typescript.ModuleKind.ESNext
    });

    const result = ExtensionsService.getTransformers(testProgram);
    const contextMock = {} as typescript.TransformationContext;

    const beforeFn = result.before?.[0](contextMock);
    const afterFn = result.after?.[0](contextMock);

    beforeFn?.(testProgram.getSourceFiles()[0]);
    afterFn?.(testProgram.getSourceFiles()[0]);

    context.assert.ok(Array.isArray(result.before));
    context.assert.ok(Array.isArray(result.after));
    context.assert.strictEqual(beforeCalled, true);
    context.assert.strictEqual(afterCalled, true);
});

test("ExtensionsService: getTransformers - returns null if no transformers", (context: TestContext) => {
    const noopExtension: ICompilerExtension = {
        name: "noop",
        getTransformers: () => ({ before: null, after: null })
    };

    (ExtensionsService as any).extensions.length = 0;
    ExtensionsService.register(noopExtension);

    const testProgram = typescript.createProgram(["tests/stubs/project/src/example.ts"], {
        module: typescript.ModuleKind.ESNext
    });

    const result = ExtensionsService.getTransformers(testProgram);

    context.assert.strictEqual(result.before, null);
    context.assert.strictEqual(result.after, null);
});
