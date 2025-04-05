export class Dictionary<TKey, TValue> {
    private items: { [key: string]: TValue } = {};

    public add(key: TKey, item: TValue): void {
        this.items[key as string] = item;
    }

    public get(key: TKey): TValue | null {
        return this.items[key as string] || null;
    }

    public remove(key: TKey): void {
        delete this.items[key as string];
    }

    public clear(): void {
        this.items = {};
    }

    public get values(): TValue[] {
        return Object.values(this.items);
    }

    public get keys(): TKey[] {
        return Object.keys(this.items) as TKey[];
    }

    public get count(): number {
        return Object.keys(this.items).length;
    }
}