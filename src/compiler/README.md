# @contextjs/compiler

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/compiler)](https://www.npmjs.com/package/@contextjs/compiler)
[![License: MIT](https://badgen.net/github/license/contextjs/context)](https://github.com/contextjs/context/blob/main/LICENSE)

> TypeScript compiler with extensibility support for internal and external transformers.

## ✨ Features

- ⚙️ Drop-in replacement for `tsc` with support for compiler extensions
- 🔌 Register transformers using the `ICompilerExtension` API
- 🧩 Cleanly integrates into the ContextJS CLI (`@contextjs/context`)
- 🧪 Full diagnostics support with clean formatting
- 📦 Designed for testability and modular build systems
- 🛠️ No external dependencies

## 📦 Installation

```bash
npm i @contextjs/compiler
```

## 🚀 Usage

### Basic Compile

```ts
import { Compiler } from "@contextjs/compiler";

const result = Compiler.compile("/absolute/project/path");

if (!result.success) {
    for (const message of result.diagnostics)
        console.error(message);
}
```

### Registering Extensions

```ts
import { Compiler, ICompilerExtension } from "@contextjs/compiler";

const myExtension: ICompilerExtension = {
    name: "my-extension",
    getTransformers(program) {
        return {
            before: [
                context => sourceFile => {
                    // Transformer logic
                    return sourceFile;
                }
            ],
            after: null
        };
    }
};

Compiler.registerExtension(myExtension);
```

## 🧪 Tests

- 100% test coverage
- Fully validated transformer registration, diagnostic formatting, and compilation logic


## 📄 API Reference

### Compiler

```ts
/**
 * Entry point to the ContextJS compiler system.
 * Provides methods for compiling TypeScript projects with internal and custom extensions.
 */
export declare class Compiler {
    /**
     * Compiles a TypeScript project using registered extensions and optional custom transformers.
     *
     * @param projectPath Path to the root of the project (must contain a `tsconfig.json`).
     * @param options Optional compile options including custom transformers and diagnostic hooks.
     * @returns A result object containing the success status and formatted diagnostics.
     */
    public static compile(projectPath: string, options?: ICompilerOptions): ICompilerResult;

    /**
     * Formats raw TypeScript diagnostic objects into clean, readable string messages.
     *
     * @param diagnostics An array of TypeScript `Diagnostic` objects.
     * @returns An array of formatted diagnostic messages.
     */
    public static formatTypescriptDiagnostics(diagnostics: typescript.Diagnostic[]): string[];

    /**
     * Registers a new compiler extension.
     * This must be called before `compile()` in order for the extension to participate.
     *
     * @param extension An object implementing `ICompilerExtension`.
     */
    public static registerExtension(extension: ICompilerExtension): void;
}
```

### Interfaces

```ts
/**
 * Represents a compiler extension that can contribute custom TypeScript transformers.
 */
export declare interface ICompilerExtension {
    /**
     * The unique name of the extension (used for identification and debugging).
     */
    name: string;

    /**
     * Provides transformer functions for a given TypeScript program.
     *
     * @param program The TypeScript program instance.
     * @returns An object containing optional `before` and `after` transformer arrays.
     */
    getTransformers(program: typescript.Program): {
        before: typescript.TransformerFactory<typescript.SourceFile>[] | null;
        after: typescript.TransformerFactory<typescript.SourceFile>[] | null;
    };
}

/**
 * Optional configuration for the `Compiler.compile()` method.
 */
export declare interface ICompilerOptions {
    /**
     * Additional custom transformers provided by the caller.
     * These will be merged with all registered internal extensions.
     */
    transformers?: typescript.CustomTransformers;

    /**
     * Optional callback invoked for each formatted diagnostic emitted during compilation.
     */
    onDiagnostic?: (diagnostic: string) => void;
}

/**
 * Result object returned by `Compiler.compile()`.
 */
export declare interface ICompilerResult {
    /**
     * Indicates whether the TypeScript emit phase completed without errors.
     */
    success: boolean;

    /**
     * Full list of formatted diagnostic messages.
     */
    diagnostics: string[];
}
```