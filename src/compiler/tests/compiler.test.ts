/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console, ConsoleArgument } from "@contextjs/system";
import test, { TestContext } from "node:test";
import path from "path";
import typescript from "typescript";
import { fileURLToPath } from "url";
import { Compiler } from "../src/compiler.js";
import { ICompilerExtension } from "../src/interfaces/i-compiler-extension.js";

test("Compiler: registerExtension - delegates to ExtensionsService", (context: TestContext) => {
    const extension: ICompilerExtension = {
        name: "mock",
        getTransformers: () => ({ before: [], after: null })
    };

    context.assert.doesNotThrow(() => Compiler.registerExtension(extension));
});

test("Compiler: compile - returns valid result", (context: TestContext) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const testDataPath = path.resolve(__dirname, "test-data");

    const result = Compiler.compile(testDataPath);

    context.assert.strictEqual(typeof result.success, "boolean");
    context.assert.strictEqual(Array.isArray(result.diagnostics), true);
});

test('Compiler: parseTypescriptArguments - parses booleans, numbers, strings, arrays', (context: TestContext) => {
    const args = [
        new ConsoleArgument('--strict', []),
        new ConsoleArgument('--target', ['ES2022']),
        new ConsoleArgument('--lib', ['DOM, ES2021']),
        new ConsoleArgument('--noEmit', ['true']),
        new ConsoleArgument('--noEmit', ["true"]),
        new ConsoleArgument('--maxNodeModuleJsDepth', ['2']),
    ];

    const options = Compiler.parseTypescriptArguments(args);

    context.assert.strictEqual(options.strict, true);
    context.assert.strictEqual(options.target, typescript.ScriptTarget.ES2022);
    context.assert.deepStrictEqual(options.lib, ['lib.dom.d.ts', 'lib.es2021.d.ts']);
    context.assert.strictEqual(options.noEmit, true);
    context.assert.strictEqual(options.maxNodeModuleJsDepth, 2);
});

test('Compiler: parseTypescriptArguments - unknown flag with suggestion', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output += message + '\n');

    const args = [new ConsoleArgument('--stric', [])];

    Compiler.parseTypescriptArguments(args);

    context.assert.strictEqual(output, '\x1b[31mUnknown compiler option \'--stric\'. Did you mean \'strict\'?\x1b[39m\n');

    Console.resetOutput();
});

test('Compiler: parseTypescriptArguments - handles enums and types correctly', (context: TestContext) => {
    const args = [
        new ConsoleArgument('--target', ['ES2022']),
        new ConsoleArgument('--module', ['esnext']),
        new ConsoleArgument('--jsx', ['react']),
        new ConsoleArgument('--strict', []),
        new ConsoleArgument('--noEmit', ['true']),
        new ConsoleArgument('--maxNodeModuleJsDepth', ['2']),
        new ConsoleArgument('--lib', ['DOM, ES2021'])
    ];

    const options = Compiler.parseTypescriptArguments(args);

    context.assert.strictEqual(options.target, typescript.ScriptTarget.ES2022);
    context.assert.strictEqual(options.module, typescript.ModuleKind.ESNext);
    context.assert.strictEqual(options.jsx, typescript.JsxEmit.React);
    context.assert.strictEqual(options.strict, true);
    context.assert.strictEqual(options.noEmit, true);
    context.assert.strictEqual(options.maxNodeModuleJsDepth, 2);
    context.assert.deepStrictEqual(options.lib, ["lib.dom.d.ts", "lib.es2021.d.ts"]);
});

test('Compiler: parseTypescriptArguments - end-to-end simulation of CLI args', (context: TestContext) => {
    const rawArgs = [
        '--target', 'ES2022',
        '--module', 'esnext',
        '--jsx', 'react',
        '--strict',
        '--noEmit', 'true',
        '--maxNodeModuleJsDepth', '2',
        '--lib', 'DOM,ES2021'
    ];

    const parsed = Console.parseArguments(rawArgs);
    const options = Compiler.parseTypescriptArguments(parsed);

    context.assert.strictEqual(options.target, typescript.ScriptTarget.ES2022);
    context.assert.strictEqual(options.module, typescript.ModuleKind.ESNext);
    context.assert.strictEqual(options.jsx, typescript.JsxEmit.React);
    context.assert.strictEqual(options.strict, true);
    context.assert.strictEqual(options.noEmit, true);
    context.assert.strictEqual(options.maxNodeModuleJsDepth, 2);
    context.assert.deepStrictEqual(options.lib, ["lib.dom.d.ts", "lib.es2021.d.ts"]);
});

test('Compiler: parseTypescriptArguments - raw CLI flags (assert all)', (context: TestContext) => {
    const rawArgs = [
        '--help',
        '--help=true',
        '--help=false',
        '--watch',
        '--watch=true',
        '--watch=false',
        '--preserveWatchOutput',
        '--preserveWatchOutput=true',
        '--preserveWatchOutput=false',
        '--listFiles',
        '--listFiles=true',
        '--listFiles=false',
        '--explainFiles',
        '--explainFiles=true',
        '--explainFiles=false',
        '--listEmittedFiles',
        '--listEmittedFiles=true',
        '--listEmittedFiles=false',
        '--pretty',
        '--pretty=true',
        '--pretty=false',
        '--traceResolution',
        '--traceResolution=true',
        '--traceResolution=false',
        '--diagnostics',
        '--diagnostics=true',
        '--diagnostics=false',
        '--extendedDiagnostics',
        '--extendedDiagnostics=true',
        '--extendedDiagnostics=false',
        '--generateCpuProfile=tsc-output.cpuprofile',
        '--generateTrace',
        'traceDir',
        '--incremental',
        '--incremental=true',
        '--incremental=false',
        '--declaration',
        '--declaration=true',
        '--declaration=false',
        '--declarationMap',
        '--declarationMap=true',
        '--declarationMap=false',
        '--emitDeclarationOnly',
        '--emitDeclarationOnly=true',
        '--emitDeclarationOnly=false',
        '--sourceMap',
        '--sourceMap=true',
        '--sourceMap=false',
        '--inlineSourceMap',
        '--inlineSourceMap=true',
        '--inlineSourceMap=false',
        '--noCheck',
        '--noCheck=true',
        '--noCheck=false',
        '--noEmit',
        '--noEmit=true',
        '--noEmit=false',
        '--assumeChangesOnlyAffectDirectDependencies',
        '--assumeChangesOnlyAffectDirectDependencies=true',
        '--assumeChangesOnlyAffectDirectDependencies=false',
        '--locale=en',
        '--all',
        '--all=true',
        '--all=false',
        '--version',
        '--version=true',
        '--version=false',
        '--init',
        '--init=true',
        '--init=false',
        '--project',
        'proj',
        '--showConfig',
        '--showConfig=true',
        '--showConfig=false',
        '--listFilesOnly',
        '--listFilesOnly=true',
        '--listFilesOnly=false',
        '--target=ES2022',
        '--module=ESNext',
        '--lib=DOM,ES2021',
        '--allowJs',
        '--allowJs=true',
        '--allowJs=false',
        '--checkJs',
        '--checkJs=true',
        '--checkJs=false',
        '--jsx=react',
        '--outFile',
        'file',
        '--outDir=./src',
        '--rootDir=./src',
        '--tsBuildInfoFile',
        'file',
        '--removeComments',
        '--removeComments=true',
        '--removeComments=false',
        '--importHelpers',
        '--importHelpers=true',
        '--importHelpers=false',
        '--downlevelIteration',
        '--downlevelIteration=true',
        '--downlevelIteration=false',
        '--isolatedModules',
        '--isolatedModules=true',
        '--isolatedModules=false',
        '--verbatimModuleSyntax',
        '--verbatimModuleSyntax=true',
        '--verbatimModuleSyntax=false',
        '--isolatedDeclarations',
        '--isolatedDeclarations=true',
        '--isolatedDeclarations=false',
        '--erasableSyntaxOnly',
        '--erasableSyntaxOnly=true',
        '--erasableSyntaxOnly=false',
        '--libReplacement',
        '--libReplacement=true',
        '--libReplacement=false',
        '--strict',
        '--strict=true',
        '--strict=false',
        '--noImplicitAny',
        '--noImplicitAny=true',
        '--noImplicitAny=false',
        '--strictNullChecks',
        '--strictNullChecks=true',
        '--strictNullChecks=false',
        '--strictFunctionTypes',
        '--strictFunctionTypes=true',
        '--strictFunctionTypes=false',
        '--strictBindCallApply',
        '--strictBindCallApply=true',
        '--strictBindCallApply=false',
        '--strictPropertyInitialization',
        '--strictPropertyInitialization=true',
        '--strictPropertyInitialization=false',
        '--strictBuiltinIteratorReturn',
        '--strictBuiltinIteratorReturn=true',
        '--strictBuiltinIteratorReturn=false',
        '--noImplicitThis',
        '--noImplicitThis=true',
        '--noImplicitThis=false',
        '--useUnknownInCatchVariables',
        '--useUnknownInCatchVariables=true',
        '--useUnknownInCatchVariables=false',
        '--alwaysStrict',
        '--alwaysStrict=true',
        '--alwaysStrict=false',
        '--noUnusedLocals',
        '--noUnusedLocals=true',
        '--noUnusedLocals=false',
        '--noUnusedParameters',
        '--noUnusedParameters=true',
        '--noUnusedParameters=false',
        '--exactOptionalPropertyTypes',
        '--exactOptionalPropertyTypes=true',
        '--exactOptionalPropertyTypes=false',
        '--noImplicitReturns',
        '--noImplicitReturns=true',
        '--noImplicitReturns=false',
        '--noFallthroughCasesInSwitch',
        '--noFallthroughCasesInSwitch=true',
        '--noFallthroughCasesInSwitch=false',
        '--noUncheckedIndexedAccess',
        '--noUncheckedIndexedAccess=true',
        '--noUncheckedIndexedAccess=false',
        '--noImplicitOverride',
        '--noImplicitOverride=true',
        '--noImplicitOverride=false',
        '--noPropertyAccessFromIndexSignature',
        '--noPropertyAccessFromIndexSignature=true',
        '--noPropertyAccessFromIndexSignature=false',
        '--moduleResolution=nodenext',
        '--baseUrl=./src',
        '--paths=null',
        '--rootDirs=null',
        '--typeRoots=./src',
        '--types',
        '--types=true',
        '--types=false',
        '--allowSyntheticDefaultImports',
        '--allowSyntheticDefaultImports=true',
        '--allowSyntheticDefaultImports=false',
        '--esModuleInterop',
        '--esModuleInterop=true',
        '--esModuleInterop=false',
        '--preserveSymlinks',
        '--preserveSymlinks=true',
        '--preserveSymlinks=false',
        '--allowUmdGlobalAccess',
        '--allowUmdGlobalAccess=true',
        '--allowUmdGlobalAccess=false',
        '--moduleSuffixes',
        '--moduleSuffixes=true',
        '--moduleSuffixes=false',
        '--allowImportingTsExtensions',
        '--allowImportingTsExtensions=true',
        '--allowImportingTsExtensions=false',
        '--rewriteRelativeImportExtensions',
        '--rewriteRelativeImportExtensions=true',
        '--rewriteRelativeImportExtensions=false',
        '--resolvePackageJsonExports',
        '--resolvePackageJsonExports=true',
        '--resolvePackageJsonExports=false',
        '--resolvePackageJsonImports',
        '--resolvePackageJsonImports=true',
        '--resolvePackageJsonImports=false',
        '--customConditions',
        '--customConditions=true',
        '--customConditions=false',
        '--noUncheckedSideEffectImports',
        '--noUncheckedSideEffectImports=true',
        '--noUncheckedSideEffectImports=false',
        '--sourceRoot=./src',
        '--mapRoot=./src',
        '--inlineSources',
        '--inlineSources=true',
        '--inlineSources=false',
        '--experimentalDecorators',
        '--experimentalDecorators=true',
        '--experimentalDecorators=false',
        '--emitDecoratorMetadata',
        '--emitDecoratorMetadata=true',
        '--emitDecoratorMetadata=false',
        '--jsxFactory',
        '--jsxFactory=true',
        '--jsxFactory=false',
        '--jsxFragmentFactory',
        '--jsxFragmentFactory=true',
        '--jsxFragmentFactory=false',
        '--jsxImportSource',
        '--jsxImportSource=true',
        '--jsxImportSource=false',
        '--resolveJsonModule',
        '--resolveJsonModule=true',
        '--resolveJsonModule=false',
        '--allowArbitraryExtensions',
        '--allowArbitraryExtensions=true',
        '--allowArbitraryExtensions=false',
        '--out',
        '--out=true',
        '--out=false',
        '--reactNamespace',
        '--reactNamespace=true',
        '--reactNamespace=false',
        '--skipDefaultLibCheck',
        '--skipDefaultLibCheck=true',
        '--skipDefaultLibCheck=false',
        '--charset',
        '--charset=true',
        '--charset=false',
        '--emitBOM',
        '--emitBOM=true',
        '--emitBOM=false',
        '--newLine=crlf',
        '--noErrorTruncation',
        '--noErrorTruncation=true',
        '--noErrorTruncation=false',
        '--noLib',
        '--noLib=true',
        '--noLib=false',
        '--noResolve',
        '--noResolve=true',
        '--noResolve=false',
        '--stripInternal',
        '--stripInternal=true',
        '--stripInternal=false',
        '--disableSizeLimit',
        '--disableSizeLimit=true',
        '--disableSizeLimit=false',
        '--disableSourceOfProjectReferenceRedirect=false',
        '--disableSolutionSearching=false',
        '--disableReferencedProjectLoad=false',
        '--noImplicitUseStrict',
        '--noImplicitUseStrict=true',
        '--noImplicitUseStrict=false',
        '--noEmitHelpers',
        '--noEmitHelpers=true',
        '--noEmitHelpers=false',
        '--noEmitOnError',
        '--noEmitOnError=true',
        '--noEmitOnError=false',
        '--preserveConstEnums',
        '--preserveConstEnums=true',
        '--preserveConstEnums=false',
        '--declarationDir=./src',
        '--skipLibCheck',
        '--skipLibCheck=true',
        '--skipLibCheck=false',
        '--allowUnusedLabels',
        '--allowUnusedLabels=true',
        '--allowUnusedLabels=false',
        '--allowUnreachableCode',
        '--allowUnreachableCode=true',
        '--allowUnreachableCode=false',
        '--suppressExcessPropertyErrors',
        '--suppressExcessPropertyErrors=true',
        '--suppressExcessPropertyErrors=false',
        '--suppressImplicitAnyIndexErrors',
        '--suppressImplicitAnyIndexErrors=true',
        '--suppressImplicitAnyIndexErrors=false',
        '--forceConsistentCasingInFileNames',
        '--forceConsistentCasingInFileNames=true',
        '--forceConsistentCasingInFileNames=false',
        '--maxNodeModuleJsDepth=2',
        '--noStrictGenericChecks',
        '--noStrictGenericChecks=true',
        '--noStrictGenericChecks=false',
        '--useDefineForClassFields',
        '--useDefineForClassFields=true',
        '--useDefineForClassFields=false',
        '--preserveValueImports',
        '--preserveValueImports=true',
        '--preserveValueImports=false',
        '--keyofStringsOnly',
        '--keyofStringsOnly=true',
        '--keyofStringsOnly=false',
        '--plugins=null',
        '--moduleDetection=auto',
        '--ignoreDeprecations',
        '--ignoreDeprecations=true',
        '--ignoreDeprecations=false',
    ];

    const args = Console.parseArguments(rawArgs);
    const result = Compiler.parseTypescriptArguments(args);

    context.assert.strictEqual(result.help, true);
    context.assert.strictEqual(result.watch, true);
    context.assert.strictEqual(result.preserveWatchOutput, true);
    context.assert.strictEqual(result.listFiles, true);
    context.assert.strictEqual(result.explainFiles, true);
    context.assert.strictEqual(result.listEmittedFiles, true);
    context.assert.strictEqual(result.pretty, true);
    context.assert.strictEqual(result.traceResolution, true);
    context.assert.strictEqual(result.diagnostics, true);
    context.assert.strictEqual(result.extendedDiagnostics, true);
    context.assert.strictEqual(result.generateCpuProfile, 'tsc-output.cpuprofile');
    context.assert.strictEqual(result.generateTrace, 'traceDir');
    context.assert.strictEqual(result.incremental, true);
    context.assert.strictEqual(result.declaration, true);
    context.assert.strictEqual(result.declarationMap, true);
    context.assert.strictEqual(result.emitDeclarationOnly, true);
    context.assert.strictEqual(result.sourceMap, true);
    context.assert.strictEqual(result.inlineSourceMap, true);
    context.assert.strictEqual(result.noCheck, true);
    context.assert.strictEqual(result.noEmit, true);
    context.assert.strictEqual(result.assumeChangesOnlyAffectDirectDependencies, true);
    context.assert.strictEqual(result.locale, "en");
    context.assert.strictEqual(result.all, true);
    context.assert.strictEqual(result.version, true);
    context.assert.strictEqual(result.init, true);
    context.assert.strictEqual(result.project, 'proj');
    context.assert.strictEqual(result.showConfig, true);
    context.assert.strictEqual(result.listFilesOnly, true);
    context.assert.ok(result.target !== undefined);
    context.assert.ok(result.module !== undefined);
    context.assert.deepStrictEqual(result.lib, ["lib.dom.d.ts", "lib.es2021.d.ts"]);
    context.assert.strictEqual(result.allowJs, true);
    context.assert.strictEqual(result.checkJs, true);
    context.assert.ok(result.jsx !== undefined);
    context.assert.strictEqual(result.outFile, 'file');
    context.assert.strictEqual(result.outDir, "./src");
    context.assert.strictEqual(result.rootDir, './src');
    context.assert.strictEqual(result.composite, undefined);
    context.assert.strictEqual(result.tsBuildInfoFile, "file");
    context.assert.strictEqual(result.removeComments, true);
    context.assert.strictEqual(result.importHelpers, true);
    context.assert.strictEqual(result.downlevelIteration, true);
    context.assert.strictEqual(result.isolatedModules, true);
    context.assert.strictEqual(result.verbatimModuleSyntax, true);
    context.assert.strictEqual(result.isolatedDeclarations, true);
    context.assert.strictEqual(result.erasableSyntaxOnly, true);
    context.assert.strictEqual(result.libReplacement, true);
    context.assert.strictEqual(result.strict, true);
    context.assert.strictEqual(result.noImplicitAny, true);
    context.assert.strictEqual(result.strictNullChecks, true);
    context.assert.strictEqual(result.strictFunctionTypes, true);
    context.assert.strictEqual(result.strictBindCallApply, true);
    context.assert.strictEqual(result.strictPropertyInitialization, true);
    context.assert.strictEqual(result.strictBuiltinIteratorReturn, true);
    context.assert.strictEqual(result.noImplicitThis, true);
    context.assert.strictEqual(result.useUnknownInCatchVariables, true);
    context.assert.strictEqual(result.alwaysStrict, true);
    context.assert.strictEqual(result.noUnusedLocals, true);
    context.assert.strictEqual(result.noUnusedParameters, true);
    context.assert.strictEqual(result.exactOptionalPropertyTypes, true);
    context.assert.strictEqual(result.noImplicitReturns, true);
    context.assert.strictEqual(result.noFallthroughCasesInSwitch, true);
    context.assert.strictEqual(result.noUncheckedIndexedAccess, true);
    context.assert.strictEqual(result.noImplicitOverride, true);
    context.assert.strictEqual(result.noPropertyAccessFromIndexSignature, true);
    context.assert.strictEqual(result.moduleResolution, typescript.ModuleResolutionKind.NodeNext);
    context.assert.strictEqual(result.baseUrl, './src');
    context.assert.strictEqual(result.paths, undefined);
    context.assert.strictEqual(result.rootDirs, undefined);
    context.assert.deepEqual(result.typeRoots, ["./src"]);
    context.assert.deepEqual(result.types, ["true"]);
    context.assert.strictEqual(result.allowSyntheticDefaultImports, true);
    context.assert.strictEqual(result.esModuleInterop, true);
    context.assert.strictEqual(result.preserveSymlinks, true);
    context.assert.strictEqual(result.allowUmdGlobalAccess, true);
    context.assert.deepEqual(result.moduleSuffixes, ["true"]);
    context.assert.strictEqual(result.allowImportingTsExtensions, true);
    context.assert.strictEqual(result.rewriteRelativeImportExtensions, true);
    context.assert.strictEqual(result.resolvePackageJsonExports, true);
    context.assert.strictEqual(result.resolvePackageJsonImports, true);
    context.assert.deepEqual(result.customConditions, ["true"]);
    context.assert.strictEqual(result.noUncheckedSideEffectImports, true);
    context.assert.strictEqual(result.sourceRoot, "./src");
    context.assert.strictEqual(result.mapRoot, "./src");
    context.assert.strictEqual(result.inlineSources, true);
    context.assert.strictEqual(result.experimentalDecorators, true);
    context.assert.strictEqual(result.emitDecoratorMetadata, true);
    context.assert.strictEqual(result.jsxFactory, "true");
    context.assert.strictEqual(result.jsxFragmentFactory, "true");
    context.assert.strictEqual(result.jsxImportSource, "true");
    context.assert.strictEqual(result.resolveJsonModule, true);
    context.assert.strictEqual(result.allowArbitraryExtensions, true);
    context.assert.strictEqual(result.reactNamespace, "true");
    context.assert.strictEqual(result.skipDefaultLibCheck, true);
    context.assert.strictEqual(result.emitBOM, true);
    context.assert.strictEqual(result.newLine, typescript.NewLineKind.CarriageReturnLineFeed);
    context.assert.strictEqual(result.noErrorTruncation, true);
    context.assert.strictEqual(result.noLib, true);
    context.assert.strictEqual(result.noResolve, true);
    context.assert.strictEqual(result.stripInternal, true);
    context.assert.strictEqual(result.disableSizeLimit, true);
    context.assert.strictEqual(result.disableSourceOfProjectReferenceRedirect, false);
    context.assert.strictEqual(result.disableSolutionSearching, false);
    context.assert.strictEqual(result.disableReferencedProjectLoad, false);
    context.assert.strictEqual(result.noEmitHelpers, true);
    context.assert.strictEqual(result.noEmitOnError, true);
    context.assert.strictEqual(result.preserveConstEnums, true);
    context.assert.strictEqual(result.declarationDir, "./src");
    context.assert.strictEqual(result.skipLibCheck, true);
    context.assert.strictEqual(result.allowUnusedLabels, true);
    context.assert.strictEqual(result.allowUnreachableCode, true);
    context.assert.strictEqual(result.forceConsistentCasingInFileNames, true);
    context.assert.strictEqual(result.maxNodeModuleJsDepth, 2);
    context.assert.strictEqual(result.useDefineForClassFields, true);
    context.assert.strictEqual(result.plugins, undefined);
    context.assert.strictEqual(result.moduleDetection, typescript.ModuleDetectionKind.Auto);
    context.assert.strictEqual(result.ignoreDeprecations, "true");
});

test('Compiler: parseTypescriptArguments - skips --extensions and -e flags', (context: TestContext) => {
    const args = [
        new ConsoleArgument('--target', ['ES2022']),
        new ConsoleArgument('--extensions', ['./my-extension.ts']),
        new ConsoleArgument('-e', ['custom-arg'])
    ];

    const options = Compiler.parseTypescriptArguments(args);

    context.assert.strictEqual(options.target, typescript.ScriptTarget.ES2022);
    context.assert.strictEqual((options as any).transformers, undefined);
});

test('Compiler: parseTypescriptArguments - verbose mode logs skipped flags --extensions', (context: TestContext) => {
    let output = '';
    Console.setOutput((message: string) => output += message + '\n');

    const args = [
        new ConsoleArgument('--target', ['ES2022']),
        new ConsoleArgument('--extensions', ['./something'])
    ];

    Compiler.parseTypescriptArguments(args, true);

    context.assert.match(output, /Skipping custom CLI flag: --extensions/);
    Console.resetOutput();
});