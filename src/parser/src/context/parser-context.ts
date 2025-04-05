/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Stack } from "@contextjs/collections";
import { Diagnostic } from "../diagnostics/diagnostic.js";
import { Location } from "../sources/location.js";
import { Source } from "../sources/source.js";
import { EndOfFileSyntaxNode } from "../syntax/end-of-file-syntax-node.js";
import { ContextState } from "./context-state.js";

export class ParserContext {
    private readonly stateStack: Stack<ContextState> = new Stack();
    private executionStopped: boolean = false;
    private startIndex: number = 0;
    private currentIndex: number = 0;

    public readonly diagnostics: Diagnostic[] = [];
    public readonly source: Source;

    public get currentCharacter() {
        return this.peek();
    }

    public get nextCharacter() {
        return this.peek(1);
    }

    public get previousCharacter() {
        return this.peek(-1);
    }

    public get currentState(): ContextState | null {
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

    public constructor(source: Source) {
        this.source = source;
    }

    public setCurrentPosition(position: number): void {
        this.currentIndex = position;
    }

    public stopFurtherExecution(): void {
        this.executionStopped = true;
    }

    public get stopped(): boolean {
        return this.executionStopped;
    }

    public setState(state: ContextState): void {
        this.stateStack.push(state);
    }

    public popState(): ContextState | null {
        return this.stateStack.pop();
    }

    public moveNext(positions: number = 1): void {
        this.currentIndex += positions;
    }

    public moveBack(positions: number = 1): void {
        this.currentIndex -= positions;
    }

    public peek(offset: number = 0): string {
        return this.currentPosition + offset >= this.source.content.length
            ? EndOfFileSyntaxNode.endOfFile
            : this.source.content[this.currentPosition + offset];
    }

    public peekMultiple(offset: number = 0): string {
        let result = "";
        let done = false;

        for (let i = 0; i < offset && !done; i++) {
            const char = this.peek(i);
            if (char === EndOfFileSyntaxNode.endOfFile)
                done = true;
            else
                result += char;
        }

        return result;
    }

    public reset(): void {
        this.startIndex = this.currentIndex;
    }

    public getLocation(startIndex: number | null = null): Location {
        const index = startIndex === null
            ? this.startIndex
            : startIndex;

        return this.source.getLocation(index, this.currentIndex, this.source.content.substring(index, this.currentIndex));
    }

    public getCurrentCharSourceLocation(): Location {
        return this.source.getLocation(this.currentIndex, this.currentIndex, this.currentCharacter);
    }

    public advanceWhile(predicate: (char: string) => boolean): string {
        let result = "";

        while (predicate(this.currentCharacter) === true) {
            result += this.currentCharacter;
            this.moveNext();
        }

        return result;
    }

    public peekUntil(predicate: (char: string) => boolean): string {
        let result = "";
        let i: number = 0;
        while (!predicate(this.peek(i))) {
            result += this.peek(i);
            i++;
        }
        result += this.peek(i);

        return result;
    }

    public peekWhile(predicate: (char: string) => boolean): string {
        let result = "";
        let i: number = 0;
        while (predicate(this.peek(i))) {
            result += this.peek(i);
            i++;
        }

        return result;
    }

    public addInfoDiagnostic(message: string): void {
        this.diagnostics.push(Diagnostic.info(message, this.getLocation()));
    }

    public addWarningDiagnostic(message: string): void {
        this.diagnostics.push(Diagnostic.warning(message, this.getLocation()));
    }

    public addErrorDiagnostic(message: string): void {
        this.diagnostics.push(Diagnostic.error(message, this.getLocation()));
    }

    public addErrorDiagnosticForCurrentCharacter(message: string): void {
        this.diagnostics.push(Diagnostic.error(message, this.getCurrentCharSourceLocation()));
    }
}