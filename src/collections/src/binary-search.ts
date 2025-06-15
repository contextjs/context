/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class BinarySearch {
    public static search<T>(items: T[], target: T, compare?: (a: T, b: T) => number): number;
    public static search<T>(items: T[], target: number, compare?: (a: T, b: number) => number): number;
    public static search<T>(items: T[], target: T | number, compare?: (a: T, b: T | number) => number): number {
        let low = 0;
        let high = items.length - 1;

        const defaultCompare = (a: any, b: any): number => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
            throw new Error("Unsupported default comparison type. Use a custom compare function.");
        };

        const comparison = compare || defaultCompare;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const comparisonResult = comparison(items[mid], target);

            if (comparisonResult === 0)
                return mid;
            if (comparisonResult < 0)
                low = mid + 1;
            else high = mid - 1;
        }

        return -1;
    }
}