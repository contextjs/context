/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class Queue<T> {
    private readonly items: T[] = [];

    public enqueue(item: T): void {
        this.items.push(item);
    }

    public dequeue(): T | null {
        return this.items.length > 0 ? this.items.shift() ?? null : null;
    }

    public get peek(): T | null {
        return this.items.length > 0 ? this.items[0] : null;
    }

    public get count(): number {
        return this.items.length;
    }

    public get isEmpty(): boolean {
        return this.items.length === 0;
    }

    public clear(): void {
        this.items.length = 0;
    }

    public toArray(): T[] {
        return this.items.slice();
    }
}