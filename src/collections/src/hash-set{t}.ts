export class HashSet<T> {
    private readonly items: T[] = [];
    private readonly equals: (a: T, b: T) => boolean;

    constructor(equals?: (a: T, b: T) => boolean) {
        this.equals = equals ?? ((a, b) => a === b);
    }

    public add(item: T): void {
        if (!this.has(item))
            this.items.push(item);
    }

    public remove(item: T): void {
        const index = this.items.findIndex(x => this.equals(x, item));
        if (index >= 0)
            this.items.splice(index, 1);
    }

    public has(item: T): boolean {
        return this.items.some(x => this.equals(x, item));
    }

    public clear(): void {
        this.items.length = 0;
    }

    public get count(): number {
        return this.items.length;
    }

    public get isEmpty(): boolean {
        return this.items.length === 0;
    }

    public toArray(): T[] {
        return [...this.items];
    }
}
