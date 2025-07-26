/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { Diagnostic, DiagnosticMessage, Location, Source } from "@contextjs/views";
import { ParserType } from "../parsers/parser.js";
import { EndOfFileSyntaxNode } from "../syntax/common/end-of-file-syntax-node.js";
import { Debug } from "./debug.js";
import { ParserContextState } from "./parser-context-state.js";

export class ParserContext {
    private readonly stateStack: Stack<ParserContextState> = new Stack();
    private startIndex: number = 0;
    private currentIndex: number = 0;

    public readonly parser: ParserType;
    public readonly diagnostics: Diagnostic[] = [];
    public readonly source: Source;
    public readonly debug: Debug;
    public readonly debugMode: boolean = false;

    public get currentCharacter(): string {
        return this.peek();
    }

    public get nextCharacter(): string {
        return this.peek(1);
    }

    public get previousCharacter(): string {
        return this.peek(-1);
    }

    public get currentState(): ParserContextState | null {
        return this.stateStack.current;
    }

    public get start(): number {
        return this.startIndex;
    }

    public get currentPosition(): number {
        return this.currentIndex;
    }

    public get currentLength(): number {
        return this.currentIndex - this.startIndex;
    }

    public constructor(source: Source, parser: ParserType, debugMode: boolean = false) {
        this.source = source;
        this.parser = parser;
        this.debugMode = debugMode;
        this.debug = new Debug(this);
    }

    public setState(state: ParserContextState): void {
        this.stateStack.push(state);
    }

    public popState(): ParserContextState | null {
        return this.stateStack.pop();
    }

    public moveNext(positions: number = 1): void {
        const contentLength = this.source.content.length;

        let next = this.currentIndex + positions;
        if (next < 0)
            next = 0;

        this.currentIndex = next > contentLength
            ? contentLength
            : next;
    }


    public moveBack(positions: number = 1): void {
        const previousIndex = this.currentIndex - positions;
        this.currentIndex = previousIndex < 0
            ? 0
            : previousIndex;
    }

    public peek(offset: number = 0): string {
        const contentLength = this.source.content.length;
        const index = this.currentIndex + offset;

        if (index < 0 || index >= contentLength)
            return EndOfFileSyntaxNode.endOfFile;

        return this.source.content[index];
    }

    public peekMultiple(offset: number = 0): string {
        if (offset <= 0)
            return "";

        const contentLength = this.source.content.length;
        let start = this.currentIndex;
        let end = start + offset;

        if (start < 0)
            start = 0;
        if (end > contentLength)
            end = contentLength;

        return this.source.content.slice(start, end);
    }

    public reset(): void {
        this.startIndex = this.currentIndex;
    }

    public getLocation(startIndex: number | null = null): Location {
        const initialIndex = startIndex === null ? this.startIndex : startIndex;
        return this.source.getLocation(initialIndex, this.currentIndex);
    }

    public advanceWhile(predicate: (char: string) => boolean): string {
        let result = "";
        const contentLength = this.source.content.length;
        let index = this.currentIndex;
        let character = (index >= 0 && index < contentLength)
            ? this.source.content[index]
            : EndOfFileSyntaxNode.endOfFile;

        while (predicate(character) && character !== EndOfFileSyntaxNode.endOfFile) {
            result += character;
            index++;

            character = (index >= 0 && index < contentLength)
                ? this.source.content[index]
                : EndOfFileSyntaxNode.endOfFile;
        }
        this.currentIndex = index;

        return result;
    }

    public peekUntil(predicate: (char: string) => boolean): string {
        let result = "";
        const contentLength = this.source.content.length;
        let i = 0;
        let index = this.currentIndex;
        let character = (index >= 0 && index < contentLength)
            ? this.source.content[index]
            : EndOfFileSyntaxNode.endOfFile;

        while (!predicate(character) && character !== EndOfFileSyntaxNode.endOfFile) {
            result += character;
            i++;
            index = this.currentIndex + i;

            character = (index >= 0 && index < contentLength)
                ? this.source.content[index]
                : EndOfFileSyntaxNode.endOfFile;
        }
        result += character;

        return result;
    }

    public peekWhile(predicate: (char: string) => boolean): string {
        let result = "";
        const contentLength = this.source.content.length;
        let i = 0;
        let index = this.currentIndex;
        let character = (index >= 0 && index < contentLength)
            ? this.source.content[index]
            : EndOfFileSyntaxNode.endOfFile;

        while (predicate(character) && character !== EndOfFileSyntaxNode.endOfFile) {
            result += character;
            i++;
            index = this.currentIndex + i;

            character = (index >= 0 && index < contentLength)
                ? this.source.content[index]
                : EndOfFileSyntaxNode.endOfFile;
        }

        return result;
    }

    public addInfoDiagnostic(message: DiagnosticMessage): void {
        this.diagnostics.push(Diagnostic.info(message, this.getLocation()));
    }

    public addWarningDiagnostic(message: DiagnosticMessage): void {
        this.diagnostics.push(Diagnostic.warning(message, this.getLocation()));
    }

    public addErrorDiagnostic(message: DiagnosticMessage): void {
        this.diagnostics.push(Diagnostic.error(message, this.getLocation()));
    }

    public ensureProgress<T>(callback: () => T, message: string): T {
        const offsetBefore = this.currentPosition;
        const result = callback();
        const offsetAfter = this.currentPosition;

        if (offsetBefore === offsetAfter && this.currentCharacter !== EndOfFileSyntaxNode.endOfFile)
            if (this.debugMode)
                this.debug.error(message);
            else
                this.moveNext();

        return result;
    }
}