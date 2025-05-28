/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Path } from '@contextjs/io';
import { RouteDefinition, RouteInfo } from '@contextjs/routing';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { TestContext } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ControllerDiscoveryService } from '../../src/services/controller-discovery-service.js';
import { VerbRouteDiscoveryService } from '../../src/services/verb-route-discovery-service.js';

const originalWorkingDirectory = process.cwd();
test.afterEach(() => process.chdir(originalWorkingDirectory));

test('ControllerDiscoveryService: getCurrentDirectory throws when tsconfig.json missing', (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    process.chdir(workingDirectory);

    context.assert.throws(() => ControllerDiscoveryService['getCurrentDirectory']());
});

test('ControllerDiscoveryService: getCurrentDirectory throws when tsconfig.json invalid', (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    const invalidTsConfig = { compilerOptions: { module: "unknownModuleKind" } };
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify(invalidTsConfig));
    process.chdir(workingDirectory);

    context.assert.strictEqual(ControllerDiscoveryService['getCurrentDirectory'](), '.');
});

test('ControllerDiscoveryService: getCurrentDirectory returns outDir from tsconfig.json', (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { outDir: './build' } }));
    process.chdir(workingDirectory);
    const outputDirectory = ControllerDiscoveryService['getCurrentDirectory']();

    context.assert.strictEqual(outputDirectory, Path.normalize('build'));
});

test('ControllerDiscoveryService: getCurrentDirectory returns "." when outDir not set', (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({}));
    process.chdir(workingDirectory);
    const outputDirectory = ControllerDiscoveryService['getCurrentDirectory']();

    context.assert.strictEqual(outputDirectory, Path.normalize('.'));
});

test('ControllerDiscoveryService: discoverAsync finds no controllers when no files', async (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
        compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
        include: ["./build/**/*"]
    }));
    const outputDirectory = path.join(workingDirectory, 'build');
    fs.mkdirSync(outputDirectory, { recursive: true });
    process.chdir(workingDirectory);

    const discoveryResult = await ControllerDiscoveryService.discoverAsync();

    context.assert.strictEqual(discoveryResult.controllers.length, 0);
    context.assert.strictEqual(discoveryResult.routes.length, 0);
});

test('ControllerDiscoveryService: discoverAsync imports files and discovers controllers/routes', async (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
        compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
        include: ["./build/**/*"]
    }));

    const outputDirectory = path.join(workingDirectory, 'build');
    fs.mkdirSync(outputDirectory, { recursive: true });

    const testFilePath = fileURLToPath(import.meta.url);
    const decoratorAbsolutePath = path.resolve(path.dirname(testFilePath), '../../src/decorators/controller.decorator.js');
    let controllerImportPath: string;

    const relativePath = path.relative(outputDirectory, decoratorAbsolutePath).replace(/\\/g, '/');
    if (relativePath.startsWith('.'))
        controllerImportPath = relativePath;
    else if (path.isAbsolute(decoratorAbsolutePath))
        controllerImportPath = pathToFileURL(decoratorAbsolutePath).href;
    else
        controllerImportPath = './' + relativePath;

    const controllerSource = `
        import { Controller } from '${controllerImportPath}';
        class DummyController {}
        Controller('templ')(DummyController);
        export { DummyController };
    `;
    const controllerFilePath = path.join(outputDirectory, 'dummy-controller.mjs');
    fs.writeFileSync(controllerFilePath, controllerSource);

    process.chdir(workingDirectory);

    context.mock.method(VerbRouteDiscoveryService, 'discoverAsync', async () => [{
        route: new RouteInfo('templ/action'),
        className: 'DummyController',
        methodName: 'action'
    } as RouteDefinition]);

    const discoveryResult = await ControllerDiscoveryService.discoverAsync();

    context.assert.strictEqual(discoveryResult.controllers.length, 1);
    context.assert.strictEqual(discoveryResult.controllers[0].name, 'DummyController');
    context.assert.strictEqual(discoveryResult.routes.length, 1);
    context.assert.strictEqual(discoveryResult.routes[0].className, 'DummyController');
});

test('ControllerDiscoveryService: discoverAsync skips files on import errors', async (context: TestContext) => {
    const workingDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'cds-'));
    fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
        compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
        include: ["./build/**/*"]
    }));
    const outputDirectory = path.join(workingDirectory, 'build');
    fs.mkdirSync(outputDirectory, { recursive: true });

    const invalidModuleFilePath = path.join(outputDirectory, 'bad-controller.mjs');
    fs.writeFileSync(invalidModuleFilePath, 'invalid js syntax');

    process.chdir(workingDirectory);

    const discoveryResult = await ControllerDiscoveryService.discoverAsync();

    context.assert.strictEqual(discoveryResult.controllers.length, 0);
    context.assert.strictEqual(discoveryResult.routes.length, 0);
});