/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from "node:test";
import type { ICompilationContext } from "../src/interfaces/i-compilation-context.js";
import type { IViewsCompilerOptions } from "../src/interfaces/i-views-compiler-options.js";
import { ViewsCompiler } from "../src/views-compiler.js";

const TEST_FILE_PATH = "index.tshtml";
const OPTIONS: IViewsCompilerOptions = { files: [TEST_FILE_PATH], projectRoot: "" };

function createContext(value: string) {
    class MockCompilationContext implements ICompilationContext {
        projectRoot: string;
        files: string[];
        layouts?: string[] | undefined;
        partials?: string[] | undefined;
        config?: Record<string, unknown> | undefined;
        public async getFileContent(filePath: string): Promise<string> {
            return value;
        }
    }

    return new MockCompilationContext();
}

function normalizeLineEndings(str: string) {
    return str.replace(/\r\n/g, "\n");
}

test("CodeGenerator: Literal/Equals", async (context: TestContext) => {
    const compilationContext = createContext("Hello, World!");
    const compiler = new ViewsCompiler(compilationContext, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "Hello, World!";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HtmlTagSyntaxNode, HtmlTagNameSyntaxNode, HtmlBracketSyntaxNode", async (context: TestContext) => {
    const contextMock = createContext("<div>Hello</div>");

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "Hello";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Html Tag With Attribute", async (context: TestContext) => {
    const contextMock = createContext('<div class="greeting"></div>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += " ";
__out += "class";
__out += "=";
__out += "\\"";
__out += "greeting";
__out += "\\"";
__out += ">";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Inline Typescript Expression", async (context: TestContext) => {
    const contextMock = createContext('<span>@(model.name)</span>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "span";
__out += ">";
__out += (model.name);
__out += "</";
__out += "span";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Typescript Statement at Root, Expression in Tag", async (context: TestContext) => {
    const contextMock = createContext('@{let greeting = "Hi";}\n<div>@(greeting)</div>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
let greeting = "Hi";
__out += "<";
__out += "div";
__out += ">";
__out += (greeting);
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Script Tag Literal Content", async (context: TestContext) => {
    const contextMock = createContext('<script>\nvar x = @model.value;</script>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "script";
__out += ">";
__out += "\n";
__out += "var x = @model.value;";
__out += "</";
__out += "script";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Style Tag Literal Content", async (context: TestContext) => {
    const contextMock = createContext('<style>\n.color { color: @(model.color); }</style>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "style";
__out += ">";
__out += "\n";
__out += ".color { color: @(model.color); }";
__out += "</";
__out += "style";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA Section", async (context: TestContext) => {
    const contextMock = createContext(`<![CDATA[
    Some <CDATA> content!
]]>`);

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<![CDATA[";
__out += "\n    Some <CDATA> content!\n";
__out += "]]>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute Value with Typescript Expression", async (context: TestContext) => {
    const contextMock = createContext('<img src="@(model.url)" />');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "img";
__out += " ";
__out += "src";
__out += "=";
__out += "\\"";
__out += (model.url);
__out += "\\"";
__out += " ";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Self-closing tag", async (context: TestContext) => {
    const contextMock = createContext("<br/>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "br";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Nested tags", async (context: TestContext) => {
    const contextMock = createContext("<ul><li>One</li><li>Two</li></ul>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "ul";
__out += ">";
__out += "<";
__out += "li";
__out += ">";
__out += "One";
__out += "</";
__out += "li";
__out += ">";
__out += "<";
__out += "li";
__out += ">";
__out += "Two";
__out += "</";
__out += "li";
__out += ">";
__out += "</";
__out += "ul";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute with spaces in value", async (context: TestContext) => {
    const contextMock = createContext('<input value="A B C"/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "input";
__out += " ";
__out += "value";
__out += "=";
__out += "\\"";
__out += "A B C";
__out += "\\"";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Multiple attributes", async (context: TestContext) => {
    const contextMock = createContext('<img alt="a" src="x.png"/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "img";
__out += " ";
__out += "alt";
__out += "=";
__out += "\\"";
__out += "a";
__out += "\\"";
__out += " ";
__out += "src";
__out += "=";
__out += "\\"";
__out += "x.png";
__out += "\\"";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Empty tag", async (context: TestContext) => {
    const contextMock = createContext('<div></div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Multiple siblings", async (context: TestContext) => {
    const contextMock = createContext('<span>One</span><span>Two</span>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "span";
__out += ">";
__out += "One";
__out += "</";
__out += "span";
__out += ">";
__out += "<";
__out += "span";
__out += ">";
__out += "Two";
__out += "</";
__out += "span";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Literal whitespace only", async (context: TestContext) => {
    const contextMock = createContext("   \t \n\n ");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "   \t \n\n ";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA with whitespace", async (context: TestContext) => {
    const contextMock = createContext(`<![CDATA[
  abc 123
  <tag>
]]>`);
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<![CDATA[";
__out += "\n  abc 123\n  <tag>\n";
__out += "]]>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Unicode and emoji in content", async (context: TestContext) => {
    const contextMock = createContext('<span>こんにちは 🌟</span>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "span";
__out += ">";
__out += "こんにちは 🌟";
__out += "</";
__out += "span";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Deeply nested HTML", async (context: TestContext) => {
    const contextMock = createContext('<div><ul><li><span>X</span></li></ul></div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "<";
__out += "ul";
__out += ">";
__out += "<";
__out += "li";
__out += ">";
__out += "<";
__out += "span";
__out += ">";
__out += "X";
__out += "</";
__out += "span";
__out += ">";
__out += "</";
__out += "li";
__out += ">";
__out += "</";
__out += "ul";
__out += ">";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with special characters", async (context: TestContext) => {
    const contextMock = createContext('<input value="a&b<c>d\'"/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "input";
__out += " ";
__out += "value";
__out += "=";
__out += "\\"";
__out += "a&b<c>d\\\'";
__out += "\\"";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML comment with dashes and unicode", async (context: TestContext) => {
    const contextMock = createContext('<!-- dash--dash — emoji 🚀 -->');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<!-- dash--dash — emoji 🚀 -->";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Standalone HTML comment with whitespace", async (context: TestContext) => {
    const contextMock = createContext('\n<!--only a comment-->\n');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "\n";
__out += "<!--only a comment-->";
__out += "\n";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with newlines/tabs", async (context: TestContext) => {
    const contextMock = createContext('<input value="A\n\tB"/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "input";
__out += " ";
__out += "value";
__out += "=";
__out += "\\"";
__out += "A\n\tB";
__out += "\\"";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Whitespace trivia between attributes", async (context: TestContext) => {
    const contextMock = createContext('<img    \t\nsrc="a"    alt="b"/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "img";
__out += "    \t\n";
__out += "src";
__out += "=";
__out += "\\"";
__out += "a";
__out += "\\"";
__out += "    ";
__out += "alt";
__out += "=";
__out += "\\"";
__out += "b";
__out += "\\"";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Single quoted attribute", async (context: TestContext) => {
    const contextMock = createContext("<input value='single'/>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "input";
__out += " ";
__out += "value";
__out += "=";
__out += "\\'";
__out += "single";
__out += "\\'";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML Comment (Trivia Handling)", async (context: TestContext) => {
    const contextMock = createContext('<!-- comment --><div>Text</div>');

    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<!-- comment -->";
__out += "<";
__out += "div";
__out += ">";
__out += "Text";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: HTML comment between tags", async (context: TestContext) => {
    const contextMock = createContext('<div><!-- hello --></div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "<!-- hello -->";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Whitespace - newlines, tabs, spaces", async (context: TestContext) => {
    const contextMock = createContext('<div>\n\t  Hello \n</div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "\n\t  ";
__out += "Hello \n";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: CDATA with embedded close marker", async (context: TestContext) => {
    const contextMock = createContext('<![CDATA[content ]]> with marker]]>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<![CDATA[";
__out += "content ";
__out += "]]>";
__out += " ";
__out += "with marker]]>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Simple expression transition", async (context: TestContext) => {
    const contextMock = createContext("<div>@(model.value)</div>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += (model.value);
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition - @@", async (context: TestContext) => {
    const contextMock = createContext("<span>@@foo</span>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "span";
__out += ">";
__out += "@foo";
__out += "</";
__out += "span";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Nested tags with expressions", async (context: TestContext) => {
    const contextMock = createContext("<ul><li>@(model.x)</li><li>@(model.y)</li></ul>");
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "ul";
__out += ">";
__out += "<";
__out += "li";
__out += ">";
__out += (model.x);
__out += "</";
__out += "li";
__out += ">";
__out += "<";
__out += "li";
__out += ">";
__out += (model.y);
__out += "</";
__out += "li";
__out += ">";
__out += "</";
__out += "ul";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition in text node", async (context: TestContext) => {
    const contextMock = createContext('<span>Hello @@world</span>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "span";
__out += ">";
__out += "Hello @world";
__out += "</";
__out += "span";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Escaped transition at content start", async (context: TestContext) => {
    const contextMock = createContext('@@hello world');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "@hello world";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Root code block and expression in tag", async (context: TestContext) => {
    const contextMock = createContext(`@{ let sum = 1+2; }\n<div>@(sum)</div>`);
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
let sum = 1+2; 
__out += "<";
__out += "div";
__out += ">";
__out += (sum);
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Expression in attribute value", async (context: TestContext) => {
    const contextMock = createContext('<img src="@(model.url)" />');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "img";
__out += " ";
__out += "src";
__out += "=";
__out += "\\"";
__out += (model.url);
__out += "\\"";
__out += " ";
__out += "/>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Expression followed by whitespace and literal", async (context: TestContext) => {
    const contextMock = createContext('<div>@(model.a) - end</div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += (model.a);
__out += " ";
__out += "- end";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Code block (not expression) followed by whitespace and literal", async (context: TestContext) => {
    const contextMock = createContext('<div>@{model.a} - end</div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
model.a
__out += "- end";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Code block inside markup (loop)", async (context: TestContext) => {
    const contextMock = createContext('@{ for(let i=0;i<2;i++) { } }<ul>@{ for(let i=0;i<2;i++) { <li>@(i)</li> } }</ul>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
for(let i=0;i<2;i++) { } 
__out += "<";
__out += "ul";
__out += ">";
for(let i=0;i<2;i++) { 
__out += "<";
__out += "li";
__out += ">";
__out += (i);
__out += "</";
__out += "li";
__out += ">";
__out += " ";
} 
__out += "</";
__out += "ul";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Complex mixed expressions, escaped transitions, blocks, nested tags", async (context: TestContext) => {
    const contextMock = createContext(`
@@Page Start@@
@{ let msg = "Hello from Views"; }
<div>
    Hi @(msg)
    <ul>
        @{ for(let i=0;i<2;i++) {
            <li>@(i)</li>
        } }
    </ul>
</div>
`);
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "\n";
__out += "@Page Start@\n";
let msg = "Hello from Views"; 
__out += "<";
__out += "div";
__out += ">";
__out += "\n    ";
__out += "Hi ";
__out += (msg);
__out += "\n    ";
__out += "<";
__out += "ul";
__out += ">";
__out += "\n        ";
for(let i=0;i<2;i++) {
            
__out += "<";
__out += "li";
__out += ">";
__out += (i);
__out += "</";
__out += "li";
__out += ">";
__out += "\n        ";
} 
__out += "</";
__out += "ul";
__out += ">";
__out += "\n";
__out += "</";
__out += "div";
__out += ">";
__out += "\n";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Attribute value with escaped quotes", async (context: TestContext) => {
    const contextMock = createContext('<input value="He said \\"hi\\"."/>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);

    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
        `export default class Index {
    public static metadata = { filePath: \"index.tshtml\" };
    public async renderAsync(model) {
let __out = \"\";
__out += \"<\";
__out += \"input\";
__out += \" \";
__out += \"value\";
__out += \"=\";
__out += \"\\\"\";
__out += \"He said \\\\\\\"hi\\\\\\\".\";
__out += \"\\\"\";
__out += \"/>\";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Simple DOCTYPE at root", async (context: TestContext) => {
    const contextMock = createContext('<!DOCTYPE html>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
`export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<!DOCTYPE html>";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: Complex legacy DOCTYPE with identifiers", async (context: TestContext) => {
    const doctype = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
    const contextMock = createContext(doctype);
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
`export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<!DOCTYPE HTML PUBLIC \\"-//W3C//DTD HTML 4.01 Transitional//EN\\" \\"http://www.w3.org/TR/html4/loose.dtd\\">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE with leading/trailing whitespace and trivia", async (context: TestContext) => {
    const contextMock = createContext('   <!DOCTYPE html>  \n<div>hi</div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
`export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "   ";
__out += "<!DOCTYPE html>";
__out += "  \n";
__out += "<";
__out += "div";
__out += ">";
__out += "hi";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE, comment, then content", async (context: TestContext) => {
    const contextMock = createContext('<!DOCTYPE html><!-- doc comment --><main>test</main>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
`export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<!DOCTYPE html>";
__out += "<!-- doc comment -->";
__out += "<";
__out += "main";
__out += ">";
__out += "test";
__out += "</";
__out += "main";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});

test("CodeGenerator: DOCTYPE inside markup (not recommended, but legal in legacy HTML)", async (context: TestContext) => {
    const contextMock = createContext('<div><!DOCTYPE weird></div>');
    const compiler = new ViewsCompiler(contextMock, OPTIONS);
    const result = await compiler.compileFile(TEST_FILE_PATH);
    const [code, sourcemap] = result.esmSource.split(/const __sourcemap\s*=/);

    const expectedCode =
`export default class Index {
    public static metadata = { filePath: "index.tshtml" };
    public async renderAsync(model) {
let __out = "";
__out += "<";
__out += "div";
__out += ">";
__out += "<!DOCTYPE weird>";
__out += "</";
__out += "div";
__out += ">";
return __out;
    }
}
`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
});