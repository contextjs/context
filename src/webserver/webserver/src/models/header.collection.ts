/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class HeaderCollection {
    private readonly headers = new Map<string, { originalName: string; value: string }>();

    public get(name: string): string | undefined {
        return this.headers.get(name.toLowerCase())?.value;
    }

    public set(name: string, value: string): void {
        this.headers.set(name.toLowerCase(), { originalName: name, value });
    }

    public has(name: string): boolean {
        return this.headers.has(name.toLowerCase());
    }

    public *entries(): IterableIterator<[string, string]> {
        for (const [, { originalName, value }] of this.headers) {
            yield [originalName, value];
        }
    }

    public *originalEntries(): IterableIterator<[string, string]> {
        for (const [key, { value }] of this.headers) {
            yield [key, value];
        }
    }

    public *keys(): IterableIterator<string> {
        for (const [, { originalName }] of this.headers) {
            yield originalName;
        }
    }

    public *values(): IterableIterator<{ originalName: string; value: string }> {
        yield* this.headers.values();
    }

    public clear(): void {
        this.headers.clear();
    }

    public [Symbol.iterator](): IterableIterator<[string, string]> {
        return this.entries();
    }
}