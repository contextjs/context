import { File, FilePathOperation, DirectoryPathOperation, PathOperationType } from "@contextjs/io";
import { NullReferenceException } from "@contextjs/system";
import test, { TestContext } from "node:test";
import { Project } from "../../src/models/project.js";

const originalReadAsync = File.readAsync;

test("Project: constructor assigns all fields (including ops and extensions)", (context: TestContext) => {
    const fileOps = [new FilePathOperation("a.txt", "b.txt", PathOperationType.Copy)];
    const dirOps = [new DirectoryPathOperation("src", "dest", PathOperationType.Move)];
    const ext = ["./compiler.js"];

    const project = new Project("Proj", "target", "main.ts", fileOps, dirOps, ext);

    context.assert.strictEqual(project.name, "Proj");
    context.assert.strictEqual(project.target, "target");
    context.assert.strictEqual(project.main, "main.ts");
    context.assert.deepEqual(project.fileOperations, fileOps);
    context.assert.deepEqual(project.directoryOperations, dirOps);
    context.assert.deepEqual(project.compilerExtensions, ext);
});

test("Project: validate throws if fileOperations has empty source/dest", (context: TestContext) => {
    const fileOps = [new FilePathOperation("", "b.txt", PathOperationType.Copy)];
    const project = new Project("X", "Y", "main.ts", fileOps);

    context.assert.throws(() => project.validate(), NullReferenceException);
});

test("Project: validate throws if directoryOperations has empty source/dest", (context: TestContext) => {
    const dirOps = [new DirectoryPathOperation("dir", "", PathOperationType.Copy)];
    const project = new Project("X", "Y", "main.ts", [], dirOps);

    context.assert.throws(() => project.validate(), NullReferenceException);
});

test("Project: validate does not throw with valid file and directory operations", (context: TestContext) => {
    const fileOps = [new FilePathOperation("a", "b", PathOperationType.Copy)];
    const dirOps = [new DirectoryPathOperation("src", "dst", PathOperationType.Copy)];
    const project = new Project("X", "Y", "main.ts", fileOps, dirOps);

    context.assert.doesNotThrow(() => project.validate());
});

test("Project: fromJson hydrates operations as proper instances", (context: TestContext) => {
    const json = JSON.stringify({
        name: "A",
        target: "t",
        main: "m.ts",
        fileOperations: [
            { source: "a.txt", destination: "b.txt", type: "copy" }
        ],
        directoryOperations: [
            { source: "src", destination: "dst", type: "move" }
        ],
        compilerExtensions: ["./x.js"]
    });

    const project = Project.fromJson(json);

    context.assert.strictEqual(project.name, "A");
    context.assert.strictEqual(project.target, "t");
    context.assert.strictEqual(project.main, "m.ts");

    context.assert.strictEqual(project.fileOperations.length, 1);
    context.assert.ok(project.fileOperations[0] instanceof FilePathOperation);
    context.assert.strictEqual(project.fileOperations[0].source, "a.txt");
    context.assert.strictEqual(project.fileOperations[0].destination, "b.txt");
    context.assert.strictEqual(project.fileOperations[0].type, PathOperationType.Copy);

    context.assert.strictEqual(project.directoryOperations.length, 1);
    context.assert.ok(project.directoryOperations[0] instanceof DirectoryPathOperation);
    context.assert.strictEqual(project.directoryOperations[0].source, "src");
    context.assert.strictEqual(project.directoryOperations[0].destination, "dst");
    context.assert.strictEqual(project.directoryOperations[0].type, PathOperationType.Move);

    context.assert.deepEqual(project.compilerExtensions, ["./x.js"]);
});

test("Project: fromJson defaults to empty arrays if missing", (context: TestContext) => {
    const json = '{"name":"P","target":"server","main":"main.ts"}';
    const project = Project.fromJson(json);

    context.assert.deepEqual(project.fileOperations, []);
    context.assert.deepEqual(project.directoryOperations, []);
    context.assert.deepEqual(project.compilerExtensions, []);
});

test("Project: fromJson does not throw but fields may be undefined if missing", (context: TestContext) => {
    const json = '{"name":"OnlyName"}';
    const project = Project.fromJson(json);

    context.assert.strictEqual(project.name, "OnlyName");
    context.assert.strictEqual(project.target, undefined);
    context.assert.strictEqual(project.main, undefined);
});

test("Project: fromJson throws on invalid JSON", (context: TestContext) => {
    const json = "{not: valid}";
    context.assert.throws(() => Project.fromJson(json), SyntaxError);
});

test("Project: fromFileAsync reads file and parses Project with operations", async (context: TestContext) => {
    let called = false;
    File.readAsync = async (filePath: string) => {
        called = true;
        context.assert.strictEqual(filePath, "/test/path/context.ctxp");
        return JSON.stringify({
            name: "FromFile",
            target: "server",
            main: "entry.ts",
            fileOperations: [{ source: "a.txt", destination: "b.txt", type: "copy" }],
            directoryOperations: [{ source: "src", destination: "dst", type: "move" }]
        });
    };

    const project = await Project.fromFileAsync("/test/path/context.ctxp");

    context.assert.strictEqual(project.name, "FromFile");
    context.assert.strictEqual(project.target, "server");
    context.assert.strictEqual(project.main, "entry.ts");
    context.assert.ok(called);
    context.assert.ok(project.fileOperations[0] instanceof FilePathOperation);
    context.assert.ok(project.directoryOperations[0] instanceof DirectoryPathOperation);

    File.readAsync = originalReadAsync;
});

test("Project: fromFileAsync propagates JSON parse errors", async (context: TestContext) => {
    File.readAsync = async () => "{invalid json}";

    await context.assert.rejects(() => Project.fromFileAsync("/bad/path"), SyntaxError);

    File.readAsync = originalReadAsync;
});

test("Project: fromFileAsync propagates File.readAsync errors", async (context: TestContext) => {
    File.readAsync = async () => { throw new Error("IO error"); };

    await context.assert.rejects(() => Project.fromFileAsync("/bad/path"), /IO error/);

    File.readAsync = originalReadAsync;
});