/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

export class Stack<T> {
    private readonly stack: T[] = [];

    public push(item: T): void {
        this.stack.push(item);
    }

    public pop(): T | null {
        return this.stack.length > 0 ? this.stack.pop() ?? null : null;
    }

    public get current(): T | null {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}