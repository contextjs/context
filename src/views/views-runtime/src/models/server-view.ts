/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { ViewBase } from "./view-base.js";

export abstract class ServerView extends ViewBase<string> {
    private readonly outputBuilder: StringBuilder = new StringBuilder();

    protected override writeLiteral(text: string): void {
        this.outputBuilder.append(text);
    }

    protected override write(value: string | null | undefined): void {
        if (StringExtensions.isNullOrEmpty(value))
            return;

        this.outputBuilder.append(this.escape(value));
    }

    protected override escape(value: string): string {
        return StringExtensions.escape(value);
    }

    protected override getOutput(): string {
        return this.outputBuilder.toString();
    }
}