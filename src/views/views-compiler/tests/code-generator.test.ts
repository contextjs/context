/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import { CompilationContext } from "../src/models/compilation-context.js";
import { ServerCompiledViewData } from "../src/models/views/server-compiled-view-data.js";
import { ViewsCompiler } from "../src/views-compiler.js";

const TEST_FILE_PATH = "index.tshtml";

function createContext(value: string) {
    return new CompilationContext(
        ".",
        [TEST_FILE_PATH],
        { "kind": "server" },
        async (filePath: string) => { return value; },
        false);
}

function normalizeLineEndings(str: string) {
    return str.replace(/\r\n/g, "\n");
}

test("CodeGenerator: Literal/Equals", async (context: TestContext) => {
    const compilationContext = createContext("Hello, World!");
    const compiler = new ViewsCompiler(compilationContext);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("Hello, World!");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});


test("CodeGenerator: HtmlTagSyntaxNode, HtmlTagNameSyntaxNode, HtmlBracketSyntaxNode", async (context: TestContext) => {
    const contextMock = createContext("<div>Hello</div>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div>Hello</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Html Tag With Attribute", async (context: TestContext) => {
    const contextMock = createContext('<div class="greeting"></div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div class=\\"greeting\\"></div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Inline Typescript Expression", async (context: TestContext) => {
    const contextMock = createContext('<span>@model.name</span>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<span>");
        this.write(model.name);
        this.writeLiteral("</span>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Typescript Statement at Root, Expression in Tag", async (context: TestContext) => {
    const contextMock = createContext('@{let greeting = "Hi";}\n<div>@greeting</div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        let greeting = "Hi";
        this.writeLiteral("\\n<div>");
        this.write(greeting);
        this.writeLiteral("</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Script Tag Literal Content", async (context: TestContext) => {
    const contextMock = createContext('<script>\nvar x = @model.value;</script>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<script>\\nvar x = @model.value;</script>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Style Tag Literal Content", async (context: TestContext) => {
    const contextMock = createContext('<style>\n.color { color: @model.color; }</style>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<style>\\n.color { color: @model.color; }</style>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA Section", async (context: TestContext) => {
    const contextMock = createContext(`<![CDATA[\n    Some <CDATA> content!\n]]>`);

    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<![CDATA[\\n    Some <CDATA> content!\\n]]>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute Value with Typescript Expression", async (context: TestContext) => {
    const contextMock = createContext('<img src="@model.url" />');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<img src=\\"");
        this.write(model.url);
        this.writeLiteral("\\" />");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Self-closing tag", async (context: TestContext) => {
    const contextMock = createContext("<br/>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<br/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Nested tags", async (context: TestContext) => {
    const contextMock = createContext("<ul><li>One</li><li>Two</li></ul>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<ul><li>One</li><li>Two</li></ul>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute with spaces in value", async (context: TestContext) => {
    const contextMock = createContext('<input value="A B C"/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<input value=\\"A B C\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Multiple attributes", async (context: TestContext) => {
    const contextMock = createContext('<img alt="a" src="x.png"/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<img alt=\\"a\\" src=\\"x.png\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Empty tag", async (context: TestContext) => {
    const contextMock = createContext('<div></div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div></div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Multiple siblings", async (context: TestContext) => {
    const contextMock = createContext('<span>One</span><span>Two</span>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<span>One</span><span>Two</span>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Literal whitespace only", async (context: TestContext) => {
    const contextMock = createContext("   \t \n\n ");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("   \\t \\n\\n ");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA with whitespace", async (context: TestContext) => {
    const contextMock = createContext(`<![CDATA[
  abc 123
  <tag>
]]>`);
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<![CDATA[\\n  abc 123\\n  <tag>\\n]]>");

        return this.getOutput();
    }
}`;


    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Unicode and emoji in content", async (context: TestContext) => {
    const contextMock = createContext('<span>こんにちは 🌟</span>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<span>こんにちは 🌟</span>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Deeply nested HTML", async (context: TestContext) => {
    const contextMock = createContext('<div><ul><li><span>X</span></li></ul></div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div><ul><li><span>X</span></li></ul></div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with special characters", async (context: TestContext) => {
    const contextMock = createContext('<input value="a&b<c>d\'"/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<input value=\\"a&b<c>d'\\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML comment with dashes and unicode", async (context: TestContext) => {
    const contextMock = createContext('<!-- dash--dash — emoji 🚀 -->');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<!-- dash--dash — emoji 🚀 -->");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Standalone HTML comment with whitespace", async (context: TestContext) => {
    const contextMock = createContext('\n<!--only a comment-->\n');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("\\n<!--only a comment-->\\n");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with newlines/tabs", async (context: TestContext) => {
    const contextMock = createContext('<input value="A\n\tB"/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<input value=\\"A\\n\\tB\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Whitespace trivia between attributes", async (context: TestContext) => {
    const contextMock = createContext('<img    \t\nsrc="a"    alt="b"/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<img    \\t\\nsrc=\\"a\\"    alt=\\"b\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Single quoted attribute", async (context: TestContext) => {
    const contextMock = createContext("<input value='single'/>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<input value='single'/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML Comment (Trivia Handling)", async (context: TestContext) => {
    const contextMock = createContext('<!-- comment --><div>Text</div>');

    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<!-- comment --><div>Text</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML comment between tags", async (context: TestContext) => {
    const contextMock = createContext('<div><!-- hello --></div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div><!-- hello --></div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Whitespace - newlines, tabs, spaces", async (context: TestContext) => {
    const contextMock = createContext('<div>\n\t  Hello \n</div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div>\\n\\t  Hello \\n</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA with embedded close marker", async (context: TestContext) => {
    const contextMock = createContext('<![CDATA[content ]]> with marker]]>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<![CDATA[content ]]> with marker]]>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Simple expression transition", async (context: TestContext) => {
    const contextMock = createContext("<div>@model.value</div>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div>");
        this.write(model.value);
        this.writeLiteral("</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition - @@", async (context: TestContext) => {
    const contextMock = createContext("<span>@@foo</span>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<span>@foo</span>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Nested tags with expressions", async (context: TestContext) => {
    const contextMock = createContext("<ul><li>@model.x</li><li>@model.y</li></ul>");
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<ul><li>");
        this.write(model.x);
        this.writeLiteral("</li><li>");
        this.write(model.y);
        this.writeLiteral("</li></ul>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition in text node", async (context: TestContext) => {
    const contextMock = createContext('<span>Hello @@world</span>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<span>Hello @world</span>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition at content start", async (context: TestContext) => {
    const contextMock = createContext('@@hello world');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("@hello world");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Root code block and expression in tag", async (context: TestContext) => {
    const contextMock = createContext(`@{ let sum = 1+2; }\n<div>@sum</div>`);
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        let sum = 1+2; 
        this.writeLiteral("\\n<div>");
        this.write(sum);
        this.writeLiteral("</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Expression in attribute value", async (context: TestContext) => {
    const contextMock = createContext('<img src="@model.url" />');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<img src=\\"");
        this.write(model.url);
        this.writeLiteral(\"\\\" />\");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Expression followed by whitespace and literal", async (context: TestContext) => {
    const contextMock = createContext('<div>@model.a - end</div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div>");
        this.write(model.a);
        this.writeLiteral(" - end</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Code block (not expression) followed by whitespace and literal", async (context: TestContext) => {
    const contextMock = createContext('<div>@{model.a} - end</div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div>");
        model.a
        this.writeLiteral(" - end</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Code block inside markup (loop)", async (context: TestContext) => {
    const contextMock = createContext('@{ for(let i=0;i<2;i++) { } }<ul>@{ for(let i=0;i<2;i++) { <li>@i</li> } }</ul>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        for(let i=0;i<2;i++) { } 
        this.writeLiteral("<ul>");
        for(let i=0;i<2;i++) { 
        this.writeLiteral("<li>");
        this.write(i);
        this.writeLiteral("</li> ");
        } 
        this.writeLiteral("</ul>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Complex mixed expressions, escaped transitions, blocks, nested tags", async (context: TestContext) => {
    const contextMock = createContext(`
@@Page Start@@
@{ let msg = "Hello from Views"; }
<div>
    Hi @msg
    <ul>
        @{ for(let i=0;i<2;i++) {
            <li>@i</li>
        } }
    </ul>
</div>
`);
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("\\n@Page Start@\\n");
        let msg = "Hello from Views"; 
        this.writeLiteral("\\n<div>\\n    Hi ");
        this.write(msg);
        this.writeLiteral("\\n    <ul>\\n        ");
        for(let i=0;i<2;i++) {
            
        this.writeLiteral("<li>");
        this.write(i);
        this.writeLiteral("</li>\\n        ");
        } 
        this.writeLiteral("\\n    </ul>\\n</div>\\n");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with escaped quotes", async (context: TestContext) => {
    const contextMock = createContext('<input value="He said \\"hi\\"."/>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<input value=\\"He said \\\\\\"hi\\\\\\".\\"/>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Simple DOCTYPE at root", async (context: TestContext) => {
    const contextMock = createContext('<!DOCTYPE html>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<!DOCTYPE html>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Complex legacy DOCTYPE with identifiers", async (context: TestContext) => {
    const doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
    const contextMock = createContext(doctype);
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01 Transitional//EN\\\" \\\"http://www.w3.org/TR/html4/loose.dtd\\\">");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE with leading/trailing whitespace and trivia", async (context: TestContext) => {
    const contextMock = createContext('   <!DOCTYPE html>  \n<div>hi</div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("   <!DOCTYPE html>  \\n<div>hi</div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE, comment, then content", async (context: TestContext) => {
    const contextMock = createContext('<!DOCTYPE html><!-- doc comment --><main>test</main>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<!DOCTYPE html><!-- doc comment --><main>test</main>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE inside markup (not recommended, but legal in legacy HTML)", async (context: TestContext) => {
    const contextMock = createContext('<div><!DOCTYPE weird></div>');
    const compiler = new ViewsCompiler(contextMock);
    const result = await compiler.compileFileAsync(TEST_FILE_PATH);

    const expectedCode =
        `import { ServerView } from "@contextjs/views";

export default class Index extends ServerView {
    public static metadata = { filePath: "index.tshtml" };

    public async renderAsync(model): Promise<string> {
        this.writeLiteral("<div><!DOCTYPE weird></div>");

        return this.getOutput();
    }
}`;

    context.assert.strictEqual(normalizeLineEndings((result.data as ServerCompiledViewData).source), normalizeLineEndings(expectedCode));
});