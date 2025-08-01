/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File, Path } from "@contextjs/io";
import test, { TestContext, after, afterEach, beforeEach } from "node:test";
import { Project } from "../../src/models/project.js";
import { ProjectsService } from "../../src/services/projects.service.js";

const originalExistsAsync = File.existsAsync;
const originalFromFileAsync = Project.fromFileAsync;
const originalGetDirectory = File.getDirectory;
const originalPathResolve = Path.resolve;

const mockProject = new Project("TestProj", "server", "main.ts");
const norm = (p: string) => p.replace(/\\/g, "/");

beforeEach(() => {
    File.existsAsync = async () => false;
    Project.fromFileAsync = async () => mockProject;
    File.getDirectory = (file: string) => norm(file).substring(0, norm(file).lastIndexOf("/"));
    Path.resolve = (path: string) => norm(path);
});

afterEach(() => {
    File.existsAsync = originalExistsAsync;
    Project.fromFileAsync = originalFromFileAsync;
    File.getDirectory = originalGetDirectory;
    Path.resolve = originalPathResolve;
});

test("ProjectsService: clearCache removes all cache entries", async (context: TestContext) => {
    const service = new ProjectsService();
    (service as any).projectCache.set("someKey", mockProject);
    service.clearCache();

    context.assert.strictEqual((service as any).projectCache.count(), 0);
});

test("ProjectsService: invalidateProject removes resolved cache entry", async (context: TestContext) => {
    const service = new ProjectsService();
    const dir = "some/dir";
    (service as any).projectCache.set(norm(dir), mockProject);
    File.getDirectory = () => dir;
    Path.resolve = (d: string) => norm(d);
    service.invalidateProject("some/dir/file.ts");

    context.assert.strictEqual((service as any).projectCache.has(norm(dir)), false);
});

test("ProjectsService: hasProjectAsync returns false if no project is found", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async () => false;
    const result = await service.hasProjectAsync("/a/b/file.ts");

    context.assert.strictEqual(result, false);
});

test("ProjectsService: hasProjectAsync returns true if project is found", async (context: TestContext) => {
    const service = new ProjectsService();
    let called = 0;
    File.existsAsync = async (p) => {
        called++;
        return norm(p as string).endsWith("/a/b/context.ctxp");
    };
    Project.fromFileAsync = async (p) => {
        context.assert.ok(norm(p).endsWith("/a/b/context.ctxp"));
        return mockProject;
    };

    const result = await service.hasProjectAsync("/a/b/file.ts");

    context.assert.strictEqual(result, true);
    context.assert.strictEqual(called > 0, true);
});

test("ProjectsService: findProjectAsync returns null if no project in any directory", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async () => false;
    const project = await service.findProjectAsync("/foo/bar/baz/file.ts");

    context.assert.strictEqual(project, null);
});

test("ProjectsService: findProjectAsync finds project in current dir", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async (p) => norm(p as string).endsWith("/mydir/context.ctxp");
    Project.fromFileAsync = async (p) => {
        context.assert.ok(norm(p).endsWith("/mydir/context.ctxp"));
        return mockProject;
    };

    const result = await service.findProjectAsync("/mydir/file.ts");

    context.assert.ok(result instanceof Project);
    context.assert.strictEqual(result.name, "TestProj");
});

test("ProjectsService: findProjectAsync finds project in parent dir", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async (p) => norm(p as string).endsWith("/root/context.ctxp");
    Project.fromFileAsync = async (p) => mockProject;

    const result = await service.findProjectAsync("/root/child/file.ts");

    context.assert.ok(result instanceof Project);
});

test("ProjectsService: findProjectAsync uses cache and does not hit filesystem twice", async (context: TestContext) => {
    const service = new ProjectsService();
    let existsCalls = 0;
    let loadCalls = 0;

    File.existsAsync = async (p) => {
        existsCalls++;
        return norm(p as string).endsWith("/dir/context.ctxp");
    };
    Project.fromFileAsync = async (p) => {
        loadCalls++;
        return mockProject;
    };

    const result1 = await service.findProjectAsync("/dir/file.ts");
    context.assert.ok(result1 instanceof Project);
    context.assert.strictEqual(loadCalls, 1);

    const result2 = await service.findProjectAsync("/dir/another.ts");
    context.assert.strictEqual(result2, result1);
    context.assert.strictEqual(loadCalls, 1);
});

test("ProjectsService: findProjectAsync removes cache and returns null if fromFileAsync fails", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async () => true;
    Project.fromFileAsync = async () => { throw new Error("bad file"); };

    const result = await service.findProjectAsync("/error/file.ts");
    context.assert.strictEqual(result, null);

    const cacheKey = norm("/error");
    context.assert.strictEqual((service as any).projectCache.has(cacheKey), false);
});

test("ProjectsService: findProjectAsync breaks on filesystem root", async (context: TestContext) => {
    const service = new ProjectsService();
    File.existsAsync = async () => false;

    const result = await service.findProjectAsync("/file.ts");
    context.assert.strictEqual(result, null);
});