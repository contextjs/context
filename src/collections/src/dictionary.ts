/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class Dictionary<TKey, TValue> {
    private readonly map = new Map<TKey, TValue>();

    public add(key: TKey, item: TValue): void {
        this.map.set(key, item);
    }

    public get(key: TKey): TValue | null {
        return this.map.has(key) ? this.map.get(key)! : null;
    }

    public has(key: TKey): boolean {
        return this.map.has(key);
    }

    public remove(key: TKey): void {
        this.map.delete(key);
    }

    public clear(): void {
        this.map.clear();
    }

    public get values(): TValue[] {
        return Array.from(this.map.values());
    }

    public get keys(): TKey[] {
        return Array.from(this.map.keys());
    }

    public get count(): number {
        return this.map.size;
    }
}