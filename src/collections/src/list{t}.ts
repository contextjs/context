export class List<T> {
    private items: Array<T> = new Array<T>();
    private size: number = 0;

    public add(item: T): void {
        this.items[this.size] = item;
        this.size++;
    }

    public remove(index: number): void {
        if (index < 0 || index >= this.size)
            return;

        for (let i = index; i < this.size - 1; i++)
            this.items[i] = this.items[i + 1];

        this.size--;
    }

    public get(index: number): T | null {
        if (index < 0 || index >= this.size)
            return null;

        return this.items[index];
    }

    public clear(): void {
        this.items = new Array<T>();
        this.size = 0;
    }

    public get count(): number {
        return this.size;
    }

    public toArray(): T[] {
        return this.items;
    }
}