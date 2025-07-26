/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from "@contextjs/system";
import { StringBuilder } from "@contextjs/text";
import test, { TestContext } from "node:test";
import { ViewBase } from "../../src/models/view-base.js";

class TestStringView extends ViewBase<string> {
    private readonly builder = new StringBuilder();

    protected override writeLiteral(text: string): void {
        this.builder.append(text);
    }

    protected override write(value: string | null | undefined): void {
        if (StringExtensions.isNullOrEmpty(value))
            return;

        this.builder.append(this.escape(value));
    }

    protected override escape(value: string): string {
        return StringExtensions.escape(value);
    }

    protected override getOutput(): string {
        return this.builder.toString();
    }
}

class CounterView extends ViewBase<number> {
    private count = 0;
    
    protected override writeLiteral(text: string): void {
        this.count++;
    }

    protected override write(value: string | null | undefined): void {
        if (!StringExtensions.isNullOrEmpty(value)) this.count++;
    }

    protected override escape(value: string): string {
        return value;
    }

    protected override getOutput(): number {
        return this.count;
    }
}

test("ViewBase<string>: writeLiteral appends text as-is", (context: TestContext) => {
    const view = new TestStringView();
    view["writeLiteral"]("abc <def>");

    context.assert.strictEqual(view["getOutput"](), "abc <def>");
});

test("ViewBase<string>: write escapes and appends value", (context: TestContext) => {
    const view = new TestStringView();
    view["write"]("<script>");

    context.assert.strictEqual(view["getOutput"](), StringExtensions.escape("<script>"));
});

test("ViewBase<string>: write ignores null and undefined", (context: TestContext) => {
    const view = new TestStringView();
    view["write"](null);
    view["write"](undefined);

    context.assert.strictEqual(view["getOutput"](), "");
});

test("ViewBase<string>: writeLiteral preserves whitespace and empty strings", (context: TestContext) => {
    const view = new TestStringView();

    view["writeLiteral"]("");
    context.assert.strictEqual(view["getOutput"](), "");

    view["writeLiteral"]("   ");
    context.assert.strictEqual(view["getOutput"](), "   ");
});

test("ViewBase<string>: write ignores empty string but allows whitespace", (context: TestContext) => {
    const view = new TestStringView();

    view["write"]("");
    context.assert.strictEqual(view["getOutput"](), "");

    view["write"]("   ");
    context.assert.strictEqual(view["getOutput"](), "   ");
});

test("ViewBase<string>: multiple calls concatenate output", (context: TestContext) => {
    const view = new TestStringView();
    view["writeLiteral"]("Hello, ");
    view["write"]("world");
    view["writeLiteral"]("!");

    context.assert.strictEqual(view["getOutput"](), "Hello, " + StringExtensions.escape("world") + "!");
});

test("ViewBase<string>: escape handles HTML special characters", (context: TestContext) => {
    const view = new TestStringView();

    context.assert.strictEqual(view["escape"]("<>&\"'"), StringExtensions.escape("<>&\"'"));
});

test("ViewBase<string>: write handles string with only whitespace", (context: TestContext) => {
    const view = new TestStringView();
    view["write"]("   ");

    context.assert.strictEqual(view["getOutput"](), "   ");
});

test("ViewBase<string>: getOutput returns empty string if no writes", (context: TestContext) => {
    const view = new TestStringView();

    context.assert.strictEqual(view["getOutput"](), "");
});

test("ViewBase<string>: getOutput works after mixed calls", (context: TestContext) => {
    const view = new TestStringView();
    view["writeLiteral"]("<ul>");
    view["write"]("item1");
    view["writeLiteral"]("</ul>");

    context.assert.strictEqual(view["getOutput"](), "<ul>" + StringExtensions.escape("item1") + "</ul>");
});


test("ViewBase<number>: supports custom output types", (context: TestContext) => {
    const view = new CounterView();
    view["writeLiteral"]("a");
    view["write"]("b");
    view["write"]("");
    view["write"](null);
    view["writeLiteral"]("c");

    context.assert.strictEqual(view["getOutput"](), 3);
});