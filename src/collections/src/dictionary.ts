/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class Dictionary<TKey, TValue> {
    private readonly map = new Map<TKey, TValue>();

    public set(key: TKey, value: TValue): void {
        this.map.set(key, value);
    }

    public get(key: TKey): TValue | null {
        return this.map.has(key) ? this.map.get(key)! : null;
    }

    public has(key: TKey): boolean {
        return this.map.has(key);
    }

    public delete(key: TKey): void {
        this.map.delete(key);
    }

    public clear(): void {
        this.map.clear();
    }

    public values(): TValue[] {
        if (this.map.size === 0)
            return [];

        return Array.from(this.map.values());
    }

    public keys(): TKey[] {
        return Array.from(this.map.keys());
    }

    public count(): number {
        return this.map.size;
    }

    public *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
        for (const entry of this.map.entries())
            yield entry;
    }
}