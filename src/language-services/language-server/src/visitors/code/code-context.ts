/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import { CodeValueSyntaxNode, SyntaxNode, ValueSyntaxNode } from "@contextjs/views-parser";

export class CodeContext {
    private regions: CodeValueSyntaxNode[] = [];
    private builder: StringBuilder = new StringBuilder();

    public reset(): void {
        this.regions.length = 0;
        this.builder.clear();
    }

    public parseCode(node: SyntaxNode): void {
        if (node instanceof CodeValueSyntaxNode && !StringExtensions.isNullOrUndefined(node.value)) {
            this.builder.append(node.value);
            this.regions.push(node);
        }
        else if (node instanceof ValueSyntaxNode && !StringExtensions.isNullOrUndefined(node.value))
            this.builder.append(node.value.replace(/[^\s]/g, ' '));
    }

    public getRegions(): CodeValueSyntaxNode[] {
        return this.regions;
    }

    public getCodeDocument(): string {
        return this.builder.toString();
    }
}