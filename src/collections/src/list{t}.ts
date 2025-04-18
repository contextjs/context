/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class List<T> {
    private items: T[];
    private size: number;

    constructor(initialCapacity = 4) {
        this.items = new Array<T>(initialCapacity);
        this.size = 0;
    }

    public add(item: T): void {
        this.ensureCapacity();
        this.items[this.size++] = item;
    }

    public remove(index: number): void {
        if (index < 0 || index >= this.size)
            return;

        for (let i = index; i < this.size - 1; i++)
            this.items[i] = this.items[i + 1];

        this.items[this.size - 1] = undefined as unknown as T; // help GC
        this.size--;
    }

    public get(index: number): T | null {
        if (index < 0 || index >= this.size)
            return null;

        return this.items[index];
    }

    public clear(): void {
        for (let i = 0; i < this.size; i++)
            this.items[i] = undefined as unknown as T;

        this.size = 0;
    }

    public get count(): number {
        return this.size;
    }

    public toArray(): T[] {
        return this.items.slice(0, this.size);
    }

    private ensureCapacity(): void {
        if (this.size >= this.items.length) {
            const newCapacity = this.items.length === 0 ? 4 : this.items.length * 2;
            const newArray = new Array<T>(newCapacity);

            for (let i = 0; i < this.size; i++)
                newArray[i] = this.items[i];

            this.items = newArray;
        }
    }
}