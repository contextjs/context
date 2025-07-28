/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { StringExtensions } from "@contextjs/system";
import { ServerView } from "../../src/models/server-view.js";

class TestServerView extends ServerView {
    public writeLiteral(text: string) { super.writeLiteral(text); }
    public write(value: string) { super.write(value); }
    public escape(value: string) { return super.escape(value); }
    public getOutput() { return super.getOutput(); }
}

test("ServerView: writeLiteral appends text as-is", (context: TestContext) => {
    const view = new TestServerView();
    view.writeLiteral("abc <def>");

    context.assert.strictEqual(view.getOutput(), "abc <def>");
});

test("ServerView: write escapes and appends value", (context: TestContext) => {
    const view = new TestServerView();
    view.write("<script>");

    context.assert.strictEqual(view.getOutput(), StringExtensions.escape("<script>"));
});

test("ServerView: write ignores null and undefined", (context: TestContext) => {
    const view = new TestServerView();

    view.write(null!);
    context.assert.strictEqual(view.getOutput(), "");

    view.write(undefined!);
    context.assert.strictEqual(view.getOutput(), "");
});

test("ServerView: writeLiteral preserves whitespace and empty strings", (context: TestContext) => {
    const view = new TestServerView();

    view.writeLiteral("");
    context.assert.strictEqual(view.getOutput(), "");

    view.writeLiteral("   ");
    context.assert.strictEqual(view.getOutput(), "   ");
});

test("ServerView: write ignores empty string but allows whitespace", (context: TestContext) => {
    const view = new TestServerView();

    view.write("");
    context.assert.strictEqual(view.getOutput(), "");

    view.write("   ");
    context.assert.strictEqual(view.getOutput(), "   ");
});

test("ServerView: multiple calls concatenate output in correct order", (context: TestContext) => {
    const view = new TestServerView();
    view.writeLiteral("Hello, ");
    view.write("world");
    view.writeLiteral("!");

    context.assert.strictEqual(view.getOutput(), "Hello, " + StringExtensions.escape("world") + "!");
});

test("ServerView: escape handles HTML special characters", (context: TestContext) => {
    const view = new TestServerView();

    context.assert.strictEqual(view.escape("<>&\"'"), StringExtensions.escape("<>&\"'"));
});

test("ServerView: write handles string with only whitespace", (context: TestContext) => {
    const view = new TestServerView();
    view.write("   ");

    context.assert.strictEqual(view.getOutput(), "   ");
});

test("ServerView: getOutput returns empty string if no writes", (context: TestContext) => {
    const view = new TestServerView();

    context.assert.strictEqual(view.getOutput(), "");
});

test("ServerView: getOutput works after mixed calls", (context: TestContext) => {
    const view = new TestServerView();
    view.writeLiteral("<ul>");
    view.write("item1");
    view.writeLiteral("</ul>");

    context.assert.strictEqual(view.getOutput(), "<ul>" + StringExtensions.escape("item1") + "</ul>");
});

test("ServerView: escaping can be customized by overriding escape", (context: TestContext) => {
    class CustomEscapeServerView extends ServerView {
        public override escape(value: string): string {
            return value.toUpperCase();
        }
        public write(value: any) { super.write(value); }
        public getOutput() { return super.getOutput(); }
    }

    const view = new CustomEscapeServerView();
    view.write("abc");

    context.assert.strictEqual(view.getOutput(), "ABC");
});

test("ServerView: output accumulates correctly over multiple writes", (context: TestContext) => {
    const view = new TestServerView();

    view.writeLiteral("First");
    context.assert.strictEqual(view.getOutput(), "First");

    view.write("Second");
    context.assert.strictEqual(view.getOutput(), "First" + StringExtensions.escape("Second"));

    view.writeLiteral("Third");
    context.assert.strictEqual(view.getOutput(), "First" + StringExtensions.escape("Second") + "Third");
});