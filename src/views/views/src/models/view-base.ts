/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export abstract class ViewBase<T> {
    protected abstract writeLiteral(text: string): void;
    protected abstract write(value: string | null | undefined): void;
    protected abstract escape(value: string): string;
    protected abstract getOutput(): T;
}