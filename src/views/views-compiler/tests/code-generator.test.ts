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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = `const __sourcemap = {"version":3,"sources":["index.tshtml"],"names":[],"mappings":";AAAA","file":"Index.ts","sourcesContent":["Hello, World!"]};`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAK;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div>Hello</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAK;AAAC;AAAA;AAAS;AAAC;AAAC;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div class=\\\"greeting\\\"></div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAI;AAAE;AAAY;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<span>@(model.name)</span>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAE;AACF;AAAC;AAAG;AAAE;AAAU;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"@{let greeting = \\\"Hi\\\";}\\n<div>@(greeting)</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAM;AAAC;;AACR;AAAqB;AAAE;AAAM\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<script>\\nvar x = @model.value;</script>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;;AACP;AAAiC;AAAE;AAAK\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<style>\\n.color { color: @(model.color); }</style>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAS;;;AAET\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<![CDATA[\\n    Some <CDATA> content!\\n]]>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAG;AAAC;AAAE;AAAW;AAAC;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<img src=\\\"@(model.url)\\\" />\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAE\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<br/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAE;AAAC;AAAC;AAAE;AAAC;AAAG;AAAE;AAAE;AAAC;AAAC;AAAE;AAAC;AAAG;AAAE;AAAE;AAAC;AAAE;AAAE\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<ul><li>One</li><li>Two</li></ul>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;AAAK;AAAC;AAAA;AAAM;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<input value=\\\"A B C\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAG;AAAC;AAAA;AAAE;AAAC;AAAC;AAAG;AAAC;AAAA;AAAM;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<img alt=\\\"a\\\" src=\\\"x.png\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div></div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAI;AAAC;AAAG;AAAE;AAAI;AAAC;AAAC;AAAI;AAAC;AAAG;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<span>One</span><span>Two</span>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA\",\"file\":\"Index.ts\",\"sourcesContent\":[\"   \\t \\n\\n \"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAS;;;;AAGT\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<![CDATA[\\n  abc 123\\n  <tag>\\n]]>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAI;AAAC;AAAQ;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<span>こんにちは 🌟</span>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAC;AAAE;AAAC;AAAC;AAAE;AAAC;AAAC;AAAI;AAAC;AAAC;AAAE;AAAI;AAAC;AAAE;AAAE;AAAC;AAAE;AAAE;AAAC;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div><ul><li><span>X</span></li></ul></div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;AAAK;AAAC;AAAA;AAAS;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<input value=\\\"a&b<c>d'\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<!-- dash--dash — emoji 🚀 -->\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;;AACA;AAAqB\",\"file\":\"Index.ts\",\"sourcesContent\":[\"\\n<!--only a comment-->\\n\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;AAAK;AAAC;AAAA;;AACX;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<input value=\\\"A\\n\\tB\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;;AACJ;AAAG;AAAC;AAAA;AAAE;AAAC;AAAI;AAAG;AAAC;AAAA;AAAE;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<img    \\t\\nsrc=\\\"a\\\"    alt=\\\"b\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;AAAK;AAAC;AAAA;AAAO;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<input value='single'/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAgB;AAAC;AAAG;AAAC;AAAI;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<!-- comment --><div>Text</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAc;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div><!-- hello --></div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;;AACF;;AACH;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div>\\n\\t  Hello \\n</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAS;AAAQ;AAAG;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<![CDATA[content ]]> with marker]]>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAE;AAAa;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div>@(model.value)</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAI;AAAC;AAAK;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<span>@@foo</span>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAE;AAAC;AAAC;AAAE;AAAE;AAAS;AAAE;AAAE;AAAC;AAAC;AAAE;AAAE;AAAS;AAAE;AAAE;AAAC;AAAE;AAAE\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<ul><li>@(model.x)</li><li>@(model.y)</li></ul>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAI;AAAC;AAAa;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<span>Hello @@world</span>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA\",\"file\":\"Index.ts\",\"sourcesContent\":[\"@@hello world\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAG;AACH;AAAC;AAAG;AAAE;AAAK;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"@{ let sum = 1+2; }\\n<div>@(sum)</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAG;AAAC;AAAE;AAAW;AAAC;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<img src=\\\"@(model.url)\\\" />\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAE;AAAS;AAAC;AAAK;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div>@(model.a) - end</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAG;AAAS;AAAK;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div>@{model.a} - end</div>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAG;AAA0B;AAAC;AAAE;AAAI;AAAuB;AAAC;AAAE;AAAE;AAAG;AAAE;AAAE;AAAC;AAAC;AAAG;AAAE;AAAE\",\"file\":\"Index.ts\",\"sourcesContent\":[\"@{ for(let i=0;i<2;i++) { } }<ul>@{ for(let i=0;i<2;i++) { <li>@(i)</li> } }</ul>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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

    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;;AACA;;AACG;AACH;AAAC;AAAG;AAAC;;AACD;AAAI;AAAK;;AACT;AAAC;AAAE;AAAC;;AACG;;AACC;AAAC;AAAE;AAAE;AAAG;AAAE;AAAE;AAAC;;AACjB;AACJ;AAAE;AAAE;AAAC;;AACT;AAAE;AAAG;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"\\n@@Page Start@@\\n@{ let msg = \\\"Hello from Views\\\"; }\\n<div>\\n    Hi @(msg)\\n    <ul>\\n        @{ for(let i=0;i<2;i++) {\\n            <li>@(i)</li>\\n        } }\\n    </ul>\\n</div>\\n\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAK;AAAC;AAAK;AAAC;AAAA;AAAgB;AAAC\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<input value=\\\"He said \\\\\\\"hi\\\\\\\".\\\"/>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = "const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<!DOCTYPE html>\"]};";

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = `const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01 Transitional//EN\\\" \\\"http://www.w3.org/TR/html4/loose.dtd\\\">\"]};`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = `const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAG;AAAe;;AAClB;AAAC;AAAG;AAAC;AAAE;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"   <!DOCTYPE html>  \\n<div>hi</div>\"]};`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = `const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAe;AAAoB;AAAC;AAAI;AAAC;AAAI;AAAE;AAAI\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<!DOCTYPE html><!-- doc comment --><main>test</main>\"]};`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
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
    const generatedMap = "const __sourcemap =" + sourcemap;
    const expectedMap = `const __sourcemap = {\"version\":3,\"sources\":[\"index.tshtml\"],\"names\":[],\"mappings\":\";AAAA;AAAC;AAAG;AAAC;AAAgB;AAAE;AAAG\",\"file\":\"Index.ts\",\"sourcesContent\":[\"<div><!DOCTYPE weird></div>\"]};`;

    context.assert.strictEqual(normalizeLineEndings(code), normalizeLineEndings(expectedCode));
    context.assert.strictEqual(generatedMap, expectedMap);
});